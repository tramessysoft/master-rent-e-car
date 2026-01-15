import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const OverViewCard = () => {
  const [expiringDocs, setExpiringDocs] = useState([]);
  const [octenCost, setOctenCost] = useState(0);
  const [dieselCost, setDieselCost] = useState(0);
  const [petrolCost, setPetrolCost] = useState(0);
  const [gasCost, setGasCost] = useState(0);
  // total maintenance cost
  const [todayCost, setTodayCost] = useState(0);
  // trip cost
  const [otherExpenses, setOtherExpenses] = useState(0);
  const [demarage, setDemarage] = useState(0);
  const [driverCommission, setDriverCommission] = useState(0);
  const [todayIncome, setTodayIncome] = useState(0);

  const today = dayjs().format("YYYY-MM-DD");

  // রিমাইন্ডার ফেচ
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(
          "https://pochao.tramessy.com/backend/api/vehicle"
        );
        const vehicles = response.data?.data || [];

        const todayDate = dayjs();
        const expiring = [];

        vehicles.forEach((vehicle) => {
          ["fitness_date", "road_permit_date", "text_date"].forEach((type) => {
            const date = dayjs(vehicle[type]);
            if (
              date.isValid() &&
              date.diff(todayDate, "day") <= 7 &&
              date.diff(todayDate, "day") >= 0
            ) {
              expiring.push({
                vehicle: vehicle.registration_number,
                document: type.replace(/_/g, " ").toUpperCase(),
                expireDate: date.format("DD-MM-YYYY"),
              });
            }
          });
        });

        setExpiringDocs(expiring);
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }
    };

    fetchVehicles();
  }, []);

  // আজকের ফুয়েল এবং গ্যাস খরচ
  useEffect(() => {
    const fetchFuelData = async () => {
      try {
        const response = await axios.get(
          "https://pochao.tramessy.com/backend/api/fuel"
        );
        const fuels = response.data?.data || [];

        let octen = 0;
        let diesel = 0;
        let petrol = 0;
        let gas = 0;

        fuels.forEach((fuel) => {
          if (fuel.date_time === today) {
            const totalPrice = parseFloat(fuel.total_price) || 0;
            const type = (fuel.type || "").toLowerCase();

            if (type === "octen") {
              octen += totalPrice;
            } else if (type === "diesel") {
              diesel += totalPrice;
            } else if (type === "petroll" || type === "petrol") {
              petrol += totalPrice;
            } else if (type === "gas") {
              gas += totalPrice;
            }
          }
        });

        setOctenCost(octen);
        setDieselCost(diesel);
        setPetrolCost(petrol);
        setGasCost(gas);
      } catch (error) {
        console.error("Error fetching fuel data:", error);
      }
    };

    fetchFuelData();
  }, [today]);

  const totalCost = octenCost + dieselCost + petrolCost + gasCost;

  // calculate total maintenance cost
  useEffect(() => {
    const fetchMaintenanceData = async () => {
      try {
        const response = await axios.get(
          "https://pochao.tramessy.com/backend/api/maintenance"
        );
        const data = response.data.data;

        const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'

        const total = data
          .filter((item) => item.date === today)
          .reduce((sum, item) => sum + parseFloat(item.total_cost), 0);

        setTodayCost(total);
      } catch (error) {
        console.error("Failed to fetch maintenance data", error);
      }
    };

    fetchMaintenanceData();
  }, []);

  // trip cost
  useEffect(() => {
    const fetchTripData = async () => {
      try {
        const response = await axios.get(
          "https://pochao.tramessy.com/backend/api/trip"
        );
        const data = response.data.data;

        const today = new Date().toISOString().split("T")[0]; // Format: "YYYY-MM-DD"

        // Filter trips that happened today only
        const todayTrips = data.filter((trip) => trip.trip_date === today);

        // Sum today's total trip expenses (other + fuel + gas)
const totalTripExpenses = todayTrips.reduce((sum, trip) => {
  const other = parseFloat(trip.other_expenses || 0);
  const fuel = parseFloat(trip.fuel_price || 0);
  const gas = parseFloat(trip.gas_price || 0);

  return sum + other + fuel + gas;
}, 0);

        // Sum today's demarage
        const totalDemarage = todayTrips.reduce(
          (sum, trip) => sum + parseFloat(trip.demarage || 0),
          0
        );
        // Sum today's driver commission
        const totalCommission = todayTrips.reduce(
          (sum, trip) => sum + parseFloat(trip.driver_percentage || 0),
          0
        );

        const totalTripIncome = todayTrips.reduce((sum, trip) => {
          const tripPrice = Number(trip.trip_price ?? 0);
          const demarage = Number(trip.demarage ?? 0);
          const rate = Number(trip.rate ?? 0);
          const fuel = parseFloat(trip.fuel_price ?? "0") || 0;
          const gas = parseFloat(trip.gas_price ?? "0") || 0;
          const others = parseFloat(trip.other_expenses ?? "0") || 0;
          const commision = trip.driver_percentage;
          const totalCost = (
            Number(fuel) +
            Number(gas) +
            Number(others) +
            Number(commision)
          ).toFixed(2);

          const revenue = tripPrice + demarage;

          const isOwnCar =
            trip.transport_type?.toLowerCase() === "own car";

          if (isOwnCar) {
            const ownRevenue = revenue - totalCost
            // Own Car → full revenue
            return sum + ownRevenue;
          } else {
            // Vendor → percentage income
            return sum + (revenue * rate) / 100;
          }
        }, 0);

        setTodayIncome(totalTripIncome.toFixed(2));
        // Sum today's trip income
        // const totalTripIncome = todayTrips.reduce(
        //   (sum, trip) => sum + parseFloat(trip.trip_price || 0),
        //   0
        // );
        setOtherExpenses(totalTripExpenses);
        setDemarage(totalDemarage);
        setDriverCommission(totalCommission);
        setTodayIncome(totalTripIncome);
      } catch (error) {
        console.error("Failed to fetch trip data", error);
      }
    };

    fetchTripData();
  }, []);

  const todayExpense = otherExpenses + driverCommission;

  // total expense
  const totalExpense = totalCost + todayCost + todayExpense;
  return (
    <div className="md:p-5">
      <ul className="md:flex gap-3">
        {/* আয় কার্ড */}
        <li className="bg-white rounded-md p-3 w-full md:w-full mb-3">
          <div className="text-primary border-b pb-3 border-gray-300">
            <h3 className="font-semibold">আজকের আয়</h3>
          </div>
          <div className="p-3 text-primary font-semibold text-sm space-y-2">
            <div className="flex items-center gap-3">
              <p className="flex justify-between w-full mt-3 pt-3">
                <span>আজকের আয়</span> - <span>{todayIncome}</span>
              </p>
            </div>
            {/* <div className="flex items-center gap-3">
              <p className="flex justify-between w-full mt-3 pt-3">
                <span>আজকের প্রফিট</span> - <span>{todayIncome}</span>
              </p>
            </div> */}
          </div>
        </li>

        {/* ব্যয় কার্ড */}
        <li className="bg-white rounded-md p-3 w-full md:w-full mb-3">
          <div className="text-primary border-b pb-3 border-gray-300">
            <h3 className="font-semibold">আজকের ব্যয়</h3>
          </div>
          <div className="p-3 text-primary font-semibold text-sm space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-primary w-[6px] h-[6px] rounded-full" />
              <p className="flex justify-between w-full">
                <span>তেলের খরচ</span> - <span>{totalCost} টাকা</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary w-[6px] h-[6px] rounded-full" />
              <p className="flex justify-between w-full">
                <span>মেইনটেনেন্স খরচ</span> -{" "}
                <span>{todayCost.toFixed(2)} টাকা</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary w-[6px] h-[6px] rounded-full" />
              <p className="flex justify-between w-full">
                <span>ট্রিপ খরচ</span> -{" "}
                <span>{todayExpense.toFixed(2)} টাকা</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="flex justify-between w-full border-t mt-3 pt-3">
                <span>মোট ব্যয়</span> -{" "}
                <span>{totalExpense.toFixed(2)} টাকা</span>
              </p>
            </div>
          </div>
        </li>

        {/* রিমাইন্ডার কার্ড */}
        <li className="bg-white rounded-md p-3 w-full md:w-full mb-3">
          <div className="text-primary border-b pb-3 border-gray-300">
            <h3 className="font-semibold">রিমাইন্ডার</h3>
          </div>
          <div className="py-3 text-primary font-semibold text-sm space-y-2">
            {expiringDocs.length > 0 ? (
              expiringDocs.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-full">
                    <p>গাড়ির নং: {item.vehicle}</p>
                    <p>ডকুমেন্টের নাম: {item.document}</p>
                    <p>মেয়াদোত্তীর্ণ তারিখ: {item.expireDate}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                কোনো মেয়াদোত্তীর্ণ ডেট নেই
              </p>
            )}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default OverViewCard;
