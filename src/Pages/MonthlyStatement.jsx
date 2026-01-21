import { useEffect, useState } from "react";
import axios from "axios";
import { FaTruck } from "react-icons/fa";
import { groupBy } from "lodash";

const MonthlyStatement = () => {
  const [statement, setStatement] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tripRes, maintenanceRes, expenseRes] = await Promise.all([
          axios.get("https://rent.demo.tramessy.com/backend/api/trip"),
          axios.get("https://rent.demo.tramessy.com/backend/api/maintenance"),
          axios.get("https://rent.demo.tramessy.com/backend/api/expense/list"),
        ]);

        const trips = tripRes.data?.data || [];
        const maintenance = maintenanceRes.data?.data || [];
        const expenses = expenseRes.data?.data || []; // <-- added

        // Group by month
        const tripsByMonth = groupBy(trips, (item) =>
          item.trip_date.slice(0, 7),
        );
        const maintenanceByMonth = groupBy(maintenance, (item) =>
          item.date.slice(0, 7),
        );
        const expenseByMonth = groupBy(expenses, (item) =>
          item.date ? item.date.slice(0, 7) : null,
        );

        const months = new Set([
          ...Object.keys(tripsByMonth),
          ...Object.keys(maintenanceByMonth),
          ...Object.keys(expenseByMonth), // <-- include expense months
        ]);

        const monthlyData = Array.from(months).map((monthKey) => {
          const tripList = tripsByMonth[monthKey] || [];
          const maintenanceList = maintenanceByMonth[monthKey] || [];
          const expenseList = expenseByMonth[monthKey] || []; // <-- only this month

          const totalTripIncome = tripList.reduce(
            (sum, item) => sum + parseFloat(item.trip_price || 0),
            0,
          );

          const totalTripCost = tripList.reduce((sum, item) => {
            const fuel = parseFloat(item.fuel_price || 0);
            const gas = parseFloat(item.gas_price || 0);
            const other = parseFloat(item.other_expenses || 0);
            const driver = parseFloat(item.driver_percentage || 0);
            return sum + fuel + gas + other + driver;
          }, 0);

          const maintenanceCost = maintenanceList.reduce(
            (sum, item) => sum + parseFloat(item.total_cost || 0),
            0,
          );

          // ✅ Fixed: Only this month's expense
          const officeCost = expenseList.reduce(
            (sum, item) => sum + parseFloat(item.pay_amount || 0),
            0,
          );

          const totalCost = totalTripCost + maintenanceCost + officeCost;
          const netProfit = totalTripIncome - totalCost;

          return {
            month: monthKey,
            totalTripIncome,
            totalTripCost,
            maintenanceCost,
            officeCost, // only this month
            totalCost,
            netProfit,
          };
        });

        monthlyData.sort((a, b) => b.month.localeCompare(a.month));
        setStatement(monthlyData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-16">Loading...</p>;

  return (
    <main className="bg-gradient-to-br from-gray-100 to-white md:p-6">
      <div className="w-xs md:w-full overflow-hidden overflow-x-auto max-w-7xl mx-auto bg-white/80 backdrop-blur-md shadow-xl rounded-xl p-2 py-10 md:p-8 border border-gray-200">
        <div className="md:flex items-center justify-between mb-6">
          <h1 className="text-xl font-extrabold text-[#11375B] flex items-center gap-3">
            <FaTruck className="text-[#11375B] text-2xl" />
            মাসিক স্টেটমেন্ট
          </h1>
        </div>

        <div className="mt-5 overflow-x-auto rounded-xl">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#11375B] text-white uppercase text-sm">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">মাস</th>
                <th className="p-2">মোট আয়</th>
                <th className="p-2">ট্রিপ খরচ</th>
                <th className="p-2">মেইনটেনেন্স খরচ</th>
                <th className="p-2">অফিস খরচ</th>
                <th className="p-2">মোট খরচ</th>
                <th className="p-2">নিট লাভ</th>
              </tr>
            </thead>
            <tbody className="text-[#11375B] font-semibold bg-gray-100">
              {statement.map((item, index) => (
                <tr
                  key={item.month}
                  className="hover:bg-gray-50 transition-all border border-gray-200"
                >
                  <td className="p-2 font-bold">{index + 1}</td>
                  <td className="p-2">
                    {new Date(item.month + "-01").toLocaleDateString("bn-BD", {
                      year: "numeric",
                      month: "long",
                    })}
                  </td>
                  <td className="p-2">{item.totalTripIncome.toFixed(2)}</td>
                  <td className="p-2">{item.totalTripCost.toFixed(2)}</td>
                  <td className="p-2">{item.maintenanceCost.toFixed(2)}</td>
                  <td className="p-2">{item.officeCost.toFixed(2)}</td>
                  <td className="p-2">{item.totalCost.toFixed(2)}</td>
                  <td className="p-2">{item.netProfit.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#EFF6FF] text-primary font-semibold border border-gray-200">
              <tr>
                <td colSpan="2" className="p-2 text-right">
                  মোট:
                </td>
                <td className="p-2">
                  {statement
                    .reduce((sum, item) => sum + item.totalTripIncome, 0)
                    .toFixed(2)}
                </td>
                <td className="p-2">
                  {statement
                    .reduce((sum, item) => sum + item.totalTripCost, 0)
                    .toFixed(2)}
                </td>
                <td className="p-2">
                  {statement
                    .reduce((sum, item) => sum + item.maintenanceCost, 0)
                    .toFixed(2)}
                </td>
                <td className="p-2">
                  {statement
                    .reduce((sum, item) => sum + item.officeCost, 0)
                    .toFixed(2)}{" "}
                  {/* ✅ officeCost total */}
                </td>
                <td className="p-2">
                  {statement
                    .reduce((sum, item) => sum + item.totalCost, 0)
                    .toFixed(2)}
                </td>
                <td className="p-2">
                  {statement
                    .reduce((sum, item) => sum + item.netProfit, 0)
                    .toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </main>
  );
};

export default MonthlyStatement;
