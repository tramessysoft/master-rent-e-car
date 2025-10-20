import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  FaTruck,
  FaChartPie,
  FaUsers,
  FaUserPlus,
  FaArrowUp,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const StatisticsCard = () => {
  const [trips, setTrips] = useState([]);
  const [vehicle, setvehicle] = useState([]);
  // const [users, setUsers] = useState([]);
  const [uniqueCustomerCount, setUniqueCustomerCount] = useState(0);
  const [driver, setDriver] = useState([]);
  // trips
  useEffect(() => {
    axios.get("https://api.dropshep.com/api/trip").then((res) => {
      setTrips(res.data.data);
    });
  }, []);
  // vehicle
  useEffect(() => {
    axios.get("https://api.dropshep.com/api/vehicle").then((res) => {
      setvehicle(res.data.data);
    });
  }, []);
  // customer count
  useEffect(() => {
    fetch("https://api.dropshep.com/api/trip")
      .then((res) => res.json())
      .then((response) => {
        const trips = response.data;

        if (Array.isArray(trips)) {
          // Extract all customer names
          const customerNames = trips
            .map((trip) => trip.customer?.trim())
            .filter((name) => name && name !== ""); // Remove null/empty values

          // Use Set to get unique names
          const uniqueCustomers = new Set(customerNames);
          setUniqueCustomerCount(uniqueCustomers.size);
        } else {
          console.error("Invalid data format:", response);
        }
      })
      .catch((error) => {
        console.error("Error fetching trips:", error);
      });
  }, []);

  // users
  // useEffect(() => {
  //   axios.get("https://api.dropshep.com/api/users").then((res) => {
  //     setUsers(res.data.data);
  //   });
  // }, []);
  // drivers
  useEffect(() => {
    axios.get("https://api.dropshep.com/api/driver").then((res) => {
      setDriver(res.data.data);
    });
  }, []);

  return (
    <div className="px-1 md:px-5 py-6">
      <ul className="grid grid-cols-2 md:flex gap-3 justify-between">
        {/* Total Trips Card */}
        <li className="bg-white p-2 md:p-3 rounded-md drop-shadow-lg w-full">
          <div className="bg-gray-100 rounded-r-md flex gap-2 md:gap-10 items-center md:pr-7 p-3 md:p-0">
            <span className="hidden md:flex bg-[#11375B] p-3 rounded-md">
              <FaTruck className="text-white text-3xl" />
            </span>
            <div>
              <h3 className="text-[#11375B] md:font-semibold">টোটাল ট্রিপ</h3>
              <span className="text-gray-500 font-semibold">
                {trips.length}
              </span>
            </div>
          </div>
          <Link to="/TripList">
            <button className="w-full mt-3 md:mt-7 text-white font-semibold text-sm bg-[#11375B] md:px-3 py-1 rounded-md hover:bg-[#062238] transition-all duration-700 cursor-pointer hover:scale-105">
              <span className="pr-1 md:pr-3">আরও তথ্য</span>
              <FaArrowUp className="inline-block" />
            </button>
          </Link>
        </li>

        {/* Total vehicle Card */}
        <li className="bg-white p-2 md:p-3 rounded-md drop-shadow-lg w-full">
          <div className="bg-gray-100 rounded-r-md flex gap-2 md:gap-10 items-center md:pr-7 p-3 md:p-0">
            <span className="hidden md:flex bg-[#11375B] p-3 rounded-md">
              <FaChartPie className="text-white text-3xl" />
            </span>
            <div>
              <h3 className="text-[#11375B] md:font-semibold">টোটাল গাড়ি</h3>
              <span className="text-gray-500 font-semibold">
                {vehicle.length}
              </span>
            </div>
          </div>
          <Link to="/CarList">
            <button className="w-full mt-3 md:mt-7 text-white font-semibold text-sm bg-[#11375B] md:px-3 py-1 rounded-md hover:bg-[#062238] transition-all duration-700 cursor-pointer hover:scale-105">
              <span className="pr-1 md:pr-3">আরও তথ্য</span>
              <FaArrowUp className="inline-block" />
            </button>
          </Link>
        </li>

        {/* Total Customers Card */}
        <li className="bg-white p-2 md:p-3 rounded-md drop-shadow-lg w-full">
          <div className="bg-gray-100 rounded-r-md flex gap-2 md:gap-10 items-center md:pr-7 p-3 md:p-0">
            <span className="hidden md:flex bg-[#11375B] p-3 rounded-md">
              <FaUsers className="text-white text-3xl" />
            </span>
            <div>
              {/* todo */}
              <h3 className="text-[#11375B] md:font-semibold">টোটাল গ্রাহক</h3>
              <span className="text-gray-500 font-semibold">
                {uniqueCustomerCount}
              </span>
            </div>
          </div>
          <Link to="/TripList">
            <button className="w-full mt-3 md:mt-7 text-white font-semibold text-sm bg-[#11375B] md:px-3 py-1 rounded-md hover:bg-[#062238] transition-all duration-700 cursor-pointer hover:scale-105">
              <span className="pr-1 md:pr-3">আরও তথ্য</span>
              <FaArrowUp className="inline-block" />
            </button>
          </Link>
        </li>

        {/* Drivers Card */}
        <li className="bg-white p-2 md:p-3 rounded-md drop-shadow-lg w-full">
          <div className="bg-gray-100 rounded-r-md flex gap-2 md:gap-10 items-center md:pr-7 p-3 md:p-0">
            <span className="hidden md:flex bg-[#11375B] p-3 rounded-md">
              <FaUserPlus className="text-white text-3xl" />
            </span>
            <div>
              <h3 className="text-[#11375B] md:font-semibold">ড্রাইভার</h3>
              <span className="text-gray-500 font-semibold">
                {driver.length}
              </span>
            </div>
          </div>
          <Link to="/DriverList">
            <button className="w-full mt-3 md:mt-7 text-white font-semibold text-sm bg-[#11375B] md:px-3 py-1 rounded-md hover:bg-[#062238] transition-all duration-700 cursor-pointer hover:scale-105">
              <span className="pr-1 md:pr-3">আরও তথ্য</span>
              <FaArrowUp className="inline-block" />
            </button>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default StatisticsCard;
