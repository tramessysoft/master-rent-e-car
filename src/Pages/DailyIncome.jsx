import { useEffect, useState } from "react";
import axios from "axios";
import { FaTruck, FaFilter, FaPen } from "react-icons/fa";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { Link } from "react-router-dom";
// export
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
const DailyIncome = () => {
  const [trips, setTrips] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  // Date filter state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // search
  const [searchTerm, setSearchTerm] = useState("");
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  // Fetch data
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get("https://api.dropshep.com/api/trip");
        const sorted = res.data.data.sort(
          (a, b) => new Date(b.trip_date) - new Date(a.trip_date)
        );
        setTrips(sorted);
      } catch (err) {
        console.error("Error fetching trips:", err);
      }
    };
    fetchTrips();
  }, []);
  // search
  const filteredIncome = trips.filter((dt) => {
    const term = searchTerm.toLowerCase();
    const tripDate = dt.trip_date;
    const matchesSearch =
      dt.trip_date?.toLowerCase().includes(term) ||
      dt.trip_time?.toLowerCase().includes(term) ||
      dt.load_point?.toLowerCase().includes(term) ||
      dt.unload_point?.toLowerCase().includes(term) ||
      dt.driver_name?.toLowerCase().includes(term) ||
      dt.driver_contact?.toLowerCase().includes(term) ||
      String(dt.driver_percentage).includes(term) ||
      dt.fuel_price?.toLowerCase().includes(term) ||
      dt.gas_price?.toLowerCase().includes(term) ||
      dt.vehicle_number?.toLowerCase().includes(term) ||
      dt.other_expenses?.toLowerCase().includes(term) ||
      dt.trip_price?.toLowerCase().includes(term);
    const matchesDateRange =
      (!startDate || new Date(tripDate) >= new Date(startDate)) &&
      (!endDate || new Date(tripDate) <= new Date(endDate));
    return matchesSearch && matchesDateRange;
  });
  // ✅ Correct headers matching your table
  const headers = [
    { label: "#", key: "index" },
    { label: "তারিখ", key: "trip_date" },
    { label: "গাড়ি", key: "vehicle_number" },
    { label: "লোড", key: "load_point" },
    { label: "আনলোড", key: "unload_point" },
    { label: "ট্রিপের ভাড়া", key: "trip_price" },
    { label: "চলমানখরচ", key: "totalCost" }, // corrected key
    { label: "লাভ", key: "profit" }, // corrected key
  ];

  // ✅ Correct CSV data mapping
  const csvData = trips.map((dt, index) => {
    const fuel = parseFloat(dt.fuel_price ?? "0") || 0;
    const gas = parseFloat(dt.gas_price ?? "0") || 0;
    const others = parseFloat(dt.other_expenses ?? "0") || 0;
    const commission = parseFloat(dt.driver_percentage ?? "0") || 0;
    const totalCost = (fuel + gas + others + commission).toFixed(2);
    const profit = (
      parseFloat(dt.trip_price ?? "0") - parseFloat(totalCost)
    ).toFixed(2);

    return {
      index: index + 1,
      trip_date: new Date(dt.trip_date).toLocaleDateString("en-GB"), // format date like in table
      vehicle_number: dt.vehicle_number,
      load_point: dt.load_point,
      unload_point: dt.unload_point,
      trip_price: dt.trip_price,
      totalCost, // ✅ use calculated total cost
      profit, // ✅ use calculated profit
    };
  });

  // ✅ Export Excel function
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trip Data");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "dailyincome_data.xlsx");
  };

  // ✅ Export PDF function
  const exportPDF = () => {
    const doc = new jsPDF();
    const headers = [
      { label: "#", key: "index" },
      { label: "Date", key: "trip_date" },
      { label: "Car", key: "vehicle_number" },
      { label: "Load", key: "load_point" },
      { label: "Unload", key: "unload_point" },
      { label: "Trip Price", key: "trip_price" },
      { label: "Total Cost", key: "totalCost" }, // corrected key
      { label: "Profit", key: "profit" }, // corrected key
    ];
    const tableColumn = headers.map((h) => h.label);
    const tableRows = csvData.map((row) => headers.map((h) => row[h.key]));

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      styles: { font: "helvetica", fontSize: 8 },
    });

    doc.save("dailyincome_data.pdf");
  };

  // ✅ Print function
  const printTable = () => {
    // hide specific column
    const actionColumns = document.querySelectorAll(".action_column");
    actionColumns.forEach((col) => {
      col.style.display = "none";
    });
    const printContent = document.querySelector("table").outerHTML;
    const WinPrint = window.open("", "", "width=900,height=650");
    WinPrint.document.write(`
    <html>
      <head>
        <title>Print</title>
        <style>
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #000; padding: 8px; text-align: center; }
        </style>
      </head>
      <body>${printContent}</body>
    </html>
  `);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  };

  // pagination
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrips = filteredIncome.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(trips.length / itemsPerPage);
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((currentPage) => currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages)
      setCurrentPage((currentPage) => currentPage + 1);
  };
  const handlePageClick = (number) => {
    setCurrentPage(number);
  };
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };
  return (
    <main className="bg-gradient-to-br from-gray-100 to-white md:p-6">
      <div className="w-xs md:w-full overflow-hidden overflow-x-auto max-w-7xl mx-auto bg-white/80 backdrop-blur-md shadow-xl rounded-xl p-2 py-10 md:p-8 border border-gray-200">
        {/* Header */}
        <div className="md:flex items-center justify-between mb-6">
          <h1 className="text-xl font-extrabold text-[#11375B] flex items-center gap-3">
            <FaTruck className="text-[#11375B] text-2xl" />
            আয়ের তালিকা
          </h1>
          <div className="mt-3 md:mt-0 flex gap-2">
            <button
              onClick={() => setShowFilter((prev) => !prev)}
              className="bg-gradient-to-r from-[#11375B] to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-4 py-1 rounded-md shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <FaFilter /> ফিল্টার
            </button>
          </div>
        </div>
        {/* Conditional Filter Section */}
        {showFilter && (
          <div className="md:flex gap-5 border border-gray-300 rounded-md p-5 my-5 transition-all duration-300 pb-5">
            <div className="relative w-64">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Start date"
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
            </div>

            <div className="relative w-64">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End date"
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
            </div>

            <div className="mt-3 md:mt-0 flex gap-2">
              <button
                onClick={() => setCurrentPage(1)}
                className="bg-gradient-to-r from-[#11375B] to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-4 py-1 rounded-md shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <FaFilter /> ফিল্টার
              </button>
            </div>
          </div>
        )}
        {/* Export & Search */}
        <div className="md:flex justify-between items-center">
          <div className="flex gap-1 md:gap-3 text-primary font-semibold rounded-md">
            <CSVLink
              data={csvData}
              headers={headers}
              filename={"dailyincome_data.csv"}
              className="py-2 px-5 hover:bg-primary bg-gray-200 hover:text-white rounded-md transition-all duration-300 cursor-pointer"
            >
              CSV
            </CSVLink>
            <button
              onClick={exportExcel}
              className="py-2 px-5 hover:bg-primary bg-gray-200 hover:text-white rounded-md transition-all duration-300 cursor-pointer"
            >
              Excel
            </button>
            <button
              onClick={exportPDF}
              className="py-2 px-5 hover:bg-primary bg-gray-200 hover:text-white rounded-md transition-all duration-300 cursor-pointer"
            >
              PDF
            </button>
            <button
              onClick={printTable}
              className="py-2 px-5 hover:bg-primary bg-gray-200 hover:text-white rounded-md transition-all duration-300 cursor-pointer"
            >
              Print
            </button>
          </div>
          {/* search */}
          <div className="mt-3 md:mt-0">
            <span className="text-primary font-semibold pr-3">Search: </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="সার্চ করুন..."
              className="border border-gray-300 rounded-md outline-none text-xs py-2 ps-2 pr-5"
            />
          </div>
        </div>
        {/* Table */}
        <div className="mt-5 overflow-x-auto rounded-xl">
          <table className="min-w-full text-sm text-left">
            {/* Table Head */}
            <thead className="bg-[#11375B] text-white uppercase text-sm">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">তারিখ</th>
                <th className="p-2">গাড়ি</th>
                <th className="p-2">লোড</th>
                <th className="p-2">আনলোড</th>
                <th className="p-2">ট্রিপের ভাড়া</th>
                <th className="p-2">চলমানখরচ</th>
                <th className="p-2">লাভ</th>
                <th className="p-2 action_column">অ্যাকশন</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="text-[#11375B] font-semibold bg-gray-100">
              {currentTrips.map((trip, index) => {
                const tripPrice = Number(trip.trip_price || 0);
                const expense =
                  Number(trip.other_expenses || 0) +
                  Number(trip.gas_price || 0) +
                  Number(trip.fuel_price || 0) +
                  Number(trip.driver_percentage || 0);
                const profit = tripPrice - expense;

                return (
                  <tr
                    key={trip.id || index}
                    className="hover:bg-gray-50 transition-all border border-gray-200"
                  >
                    <td className="p-2 font-bold">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="p-2">
                      {new Date(trip.trip_date).toLocaleDateString("en-GB")}
                    </td>
                    <td className="p-2">{trip.vehicle_number}</td>
                    <td className="p-2">{trip.load_point}</td>
                    <td className="p-2">{trip.unload_point}</td>
                    <td className="p-2">{tripPrice.toFixed(2)}</td>
                    <td className="p-2">{expense.toFixed(2)}</td>
                    <td className="p-2">{profit.toFixed(2)}</td>
                    <td className="action_column">
                      <div className="flex justify-center">
                        <Link to={`/UpdateDailyIncomeForm/${trip.id}`}>
                          <button className="text-primary hover:bg-primary hover:text-white px-2 py-1 rounded shadow-md transition-all cursor-pointer">
                            <FaPen className="text-[12px]" />
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Table Footer */}
            <tfoot className="bg-[#EFF6FF] text-[#11375B] font-semibold border border-gray-200">
              <tr>
                <td colSpan="5" className="p-2 text-right">
                  মোট:
                </td>
                <td className="p-2">
                  {currentTrips
                    .reduce((sum, t) => sum + Number(t.trip_price || 0), 0)
                    .toFixed(2)}
                </td>
                <td className="p-2">
                  {currentTrips
                    .reduce(
                      (sum, t) =>
                        sum +
                        Number(t.other_expenses || 0) +
                        Number(t.gas_price || 0) +
                        Number(t.fuel_price || 0) +
                        Number(t.driver_percentage || 0),
                      0
                    )
                    .toFixed(2)}
                </td>
                <td className="p-2">
                  {currentTrips
                    .reduce((sum, t) => {
                      const trip = Number(t.trip_price || 0);
                      const expense =
                        Number(t.other_expenses || 0) +
                        Number(t.gas_price || 0) +
                        Number(t.fuel_price || 0) +
                        Number(t.driver_percentage || 0);
                      return sum + (trip - expense);
                    }, 0)
                    .toFixed(2)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* pagination */}
        <div className="mt-10 flex justify-center">
          <div className="space-x-2 flex items-center">
            <button
              onClick={handlePrevPage}
              className={`p-2 ${
                currentPage === 1 ? "bg-gray-300" : "bg-primary text-white"
              } rounded-sm`}
              disabled={currentPage === 1}
            >
              <GrFormPrevious />
            </button>
            {getPageNumbers().map((number, idx) =>
              number === "..." ? (
                <span key={`dots-${idx}`} className="px-2 text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={`${number}-${idx}`}
                  onClick={() => handlePageClick(number)}
                  className={`w-8 h-8 rounded-sm flex items-center justify-center text-sm font-medium hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer ${
                    currentPage === number
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-primary hover:bg-gray-200"
                  }`}
                >
                  {number}
                </button>
              )
            )}
            <button
              onClick={handleNextPage}
              className={`p-2 ${
                currentPage === totalPages
                  ? "bg-gray-300"
                  : "bg-primary text-white"
              } rounded-sm`}
              disabled={currentPage === totalPages}
            >
              <GrFormNext />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default DailyIncome;
