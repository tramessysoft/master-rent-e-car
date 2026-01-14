import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  FaTruck,
  FaPlus,
  FaFilter,
  FaPen,
  FaEye,
  FaTrashAlt,
} from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
// export
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { AuthContext } from "../providers/AuthProvider";
const TripList = () => {
  const { user } = useContext(AuthContext);
  console.log("users", user.data.user.role);
  const [trip, setTrip] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  // Date filter state
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // delete modal
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTripId, setselectedTripId] = useState(null);
  const toggleModal = () => setIsOpen(!isOpen);

  // get single trip info by id
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTrip, setselectedTrip] = useState(null);
  // search
  const [searchTerm, setSearchTerm] = useState("");
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  // Fetch trips data
  useEffect(() => {
    axios
      .get("https://pochao.tramessy.com/backend/api/trip")
      .then((response) => {
        if (response.data.status === "success") {
          const sortedData = response.data.data.sort((a, b) => {
            return new Date(b.trip_date) - new Date(a.trip_date);
          });
          setTrip(sortedData);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching trip data:", error);
        setLoading(false);
      });
  }, []);
  if (loading) return <p className="text-center mt-16">Loading trip...</p>;
  // delete by id
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://pochao.tramessy.com/backend/api/trip/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete trip");
      }
      // Remove trip from local list
      setTrip((prev) => prev.filter((driver) => driver.id !== id));
      toast.success("ট্রিপ সফলভাবে ডিলিট হয়েছে", {
        position: "top-right",
        autoClose: 3000,
      });

      setIsOpen(false);
      setselectedTripId(null);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("ডিলিট করতে সমস্যা হয়েছে!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  // view trip by id
  const handleView = async (id) => {
    try {
      const response = await axios.get(
        `https://pochao.tramessy.com/backend/api/trip/${id}`
      );
      if (response.data.status === "success") {
        setselectedTrip(response.data.data);
        setViewModalOpen(true);
      } else {
        toast.error("ড্রাইভারের তথ্য লোড করা যায়নি");
      }
    } catch (error) {
      console.error("View error:", error);
      toast.error("ড্রাইভারের তথ্য আনতে সমস্যা হয়েছে");
    }
  };

  const csvData = trip.map((dt, index) => {
    const fuel = parseFloat(dt.fuel_price ?? "0") || 0;
    const gas = parseFloat(dt.gas_price ?? "0") || 0;
    const others = parseFloat(dt.other_expenses ?? "0") || 0;
    const commission = parseFloat(dt.driver_percentage ?? "0") || 0;
    const totalCost = (
      Number(fuel) +
      Number(gas) +
      Number(others) +
      Number(commission)
    ).toFixed(2);
    const profit = (dt.trip_price - totalCost).toFixed(2);

    return {
      index: index + 1,
      trip_date: dt.trip_date,
      driver_name: dt.driver_name,
      driver_contact: dt.driver_contact,
      driver_percentage: dt.driver_percentage,
      load_point: dt.load_point,
      unload_point: dt.unload_point,
      trip_time: dt.trip_time,
      totalCost,
      trip_price: dt.trip_price,
      profit,
    };
  });
  // Filter trips by search term and date range
  const filteredTrip = trip.filter((dt) => {
    const term = searchTerm.toLowerCase();
    const tripDate = dt.trip_date;
    const matchesSearch =
      dt.trip_date?.toLowerCase().includes(term) ||
      dt.trip_time?.toLowerCase().includes(term) ||
      dt.load_point?.toLowerCase().includes(term) ||
      dt.unload_point?.toLowerCase().includes(term) ||
      dt.driver_name?.toLowerCase().includes(term) ||
      dt.customer?.toLowerCase().includes(term) ||
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

  const exportExcel = () => {
  // Map filtered data to match table columns
  const formattedData = filteredData.map((dt, index) => {
    const demarage = parseFloat(dt.demarage ?? "0") || 0;
    const fuel = parseFloat(dt.fuel_price ?? "0") || 0;
    const gas = parseFloat(dt.gas_price ?? "0") || 0;
    const others = parseFloat(dt.other_expenses ?? "0") || 0;
    const commision = parseFloat(dt.driver_percentage ?? "0") || 0;

    const totalCost = (
      demarage + fuel + gas + others + commision
    ).toFixed(2);

    const profit =
      dt.transport_type === "Own Car"
        ? (dt.trip_price - totalCost).toFixed(2)
        : ((dt.trip_price * dt.rate) / 100).toFixed(2);

    return {
      "#": index + 1,
      "তারিখ": dt.trip_date,
      "ড্রাইভার নাম": dt.driver_name,
      "ড্রাইভার মোবাইল": dt.driver_contact,
      "ট্রান্সপোর্ট টাইপ" : dt.transport_type,
      "কমিশন রেট" : dt.rate,
      "ড্রাইভার কমিশন": dt.driver_percentage,
      "কোম্পানি কমিশন": dt.company_comission,
      "লোড পয়েন্ট": dt.load_point,
      "আনলোড পয়েন্ট": dt.unload_point,
      "ট্রিপের সময়": dt.trip_time,
      "কাস্টমারের নাম": dt.customer,
      "কাস্টমারের মোবাইল": dt.customer_mobile,
      "ট্রিপের ভাড়া": dt.trip_price,     
      "তেলের মূল্য": dt.fuel_price,
      "গ্যাসের মূল্য": dt.gas_price,
      "অন্যান্য খরচ":dt.other_expenses,
      "ট্রিপের খরচ": totalCost,
      "লাভ": profit,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Trip Data");

  XLSX.writeFile(workbook, "trip_data.xlsx");
};

// Print Function
const printTable = () => {
  // hide action column while printing
  const actionColumns = document.querySelectorAll(".action_column");
  actionColumns.forEach((col) => {
    col.style.display = "none";
  });

  const printContent = document.querySelector("table").outerHTML;

  const WinPrint = window.open("", "", "width=1000,height=800");
  WinPrint.document.write(`
    <html>
      <head>
        <title>Trip List</title>
        <style>
          body { font-family: Arial, sans-serif; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 6px; text-align: left; font-size: 12px; }
          th { background-color: #11375B; color: white; }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `);
  WinPrint.document.close();
  WinPrint.focus();
  WinPrint.print();

  // show action columns back
  actionColumns.forEach((col) => {
    col.style.display = "";
  });
};

  // pagination
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTrip = filteredTrip.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(trip.length / itemsPerPage);
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
      <Toaster />
      <div className="w-xs md:w-full overflow-hidden overflow-x-auto max-w-7xl mx-auto bg-white/80 backdrop-blur-md shadow-xl rounded-xl p-2 py-10 md:p-8 border border-gray-200">
        {/* Header */}
        <div className="md:flex items-center justify-between mb-6">
          <h1 className="text-xl font-extrabold text-[#11375B] flex items-center gap-3">
            <FaTruck className="text-[#11375B] text-2xl" />
            ট্রিপের হিসাব
          </h1>
          <div className="mt-3 md:mt-0 flex gap-2">
            <Link to="/AddTripForm">
              <button className="bg-gradient-to-r from-[#11375B] to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-4 py-1 rounded-md shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer">
                <FaPlus /> ট্রিপ
              </button>
            </Link>
            <button
              onClick={() => setShowFilter((prev) => !prev)} // Toggle filter
              className="bg-gradient-to-r from-[#11375B] to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-4 py-1 rounded-md shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <FaFilter /> ফিল্টার
            </button>
          </div>
        </div>
        {/* export and search*/}
        <div className="md:flex justify-between items-center">
          <div className="flex gap-1 md:gap-3 text-primary font-semibold rounded-md">
            {/* <CSVLink
              data={csvData}
              headers={headers}
              filename={"trip_data.csv"}
              className="py-2 px-5 hover:bg-primary bg-gray-200 hover:text-white rounded-md transition-all duration-300 cursor-pointer"
            >
              CSV
            </CSVLink> */}
            <button
              onClick={exportExcel}
              className="py-2 px-5 hover:bg-primary bg-gray-200 hover:text-white rounded-md transition-all duration-300 cursor-pointer"
            >
              Excel
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

        {/* Table */}
        <div className="mt-5 overflow-x-auto rounded-xl">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#11375B] text-white uppercase text-sm">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">তারিখ</th>
                <th className="p-2">ড্রাইভার ইনফো</th>
                <th className="p-2">ট্রিপ এবং গন্তব্য</th>
                <th className="p-2">কাস্টমারের তথ্য</th>
                <th className="p-2">ট্রিপের ভাড়া</th>
                <th className="p-2">ট্রিপের খরচ</th>
                <th className="p-2">লাভ</th>
                {user.data.user.role === "User" ? (
                  ""
                ) : (
                  <th className="p-2 action_column">অ্যাকশন</th>
                )}
              </tr>
            </thead>
            <tbody className="text-[#11375B] font-semibold bg-gray-100">
              {currentTrip?.map((dt, index) => {
                const demarage = parseFloat(dt.demarage ?? "0") || 0;
                const fuel = parseFloat(dt.fuel_price ?? "0") || 0;
                const gas = parseFloat(dt.gas_price ?? "0") || 0;
                const others = parseFloat(dt.other_expenses ?? "0") || 0;
                const commision = dt.driver_percentage;
                const totalCost = (
                  Number(demarage) +
                  Number(fuel) +
                  Number(gas) +
                  Number(others) +
                  Number(commision)
                ).toFixed(2);

                return (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-all border-b border-gray-200"
                  >
                    <td className="p-2 font-bold">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="p-2">{dt.trip_date}</td>
                    <td className="p-2">
                      <p>নামঃ {dt.driver_name}</p>
                      <p>মোবাইলঃ {dt.driver_contact}</p>
                      <p>কমিশনঃ {dt.driver_percentage}</p>
                    </td>
                    <td className="p-2">
                      <p>তারিখঃ {dt.trip_date}</p>
                      <p>পিকআপ পয়েন্টঃ {dt.load_point}</p>
                      <p>ড্রপ পয়েন্টঃ {dt.unload_point}</p>
                      <p>
                        ট্রিপের সময়ঃ{" "}
                        {new Date(
                          `1970-01-01T${dt.trip_time}`
                        ).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </td>
                    <td className="p-2">
                      <p>
                        কাস্টমারের নামঃ <p>{dt.customer}</p>
                      </p>
                      <p>
                        কাস্টমারের মোবাইলঃ <p>{dt.customer_mobile}</p>
                      </p>
                    </td>
                    <td className="p-2">{dt.trip_price}</td>
                    <td className="p-2">{dt.transport_type === "Own car" ? totalCost: dt.rate}</td>
                    <td className="p-2">
                      {dt.transport_type === "Own car" ? (dt.trip_price - totalCost).toFixed(2) : (dt.trip_price* dt.rate)/100}
                    </td>
                    {user.data.user.role === "User" ? (
                      ""
                    ) : (
                      <td className="px-1 action_column">
                        <div className="flex gap-1">
                          <Link to={`/UpdateTripForm/${dt.id}`}>
                            <button className="text-primary hover:bg-primary hover:text-white px-2 py-1 rounded shadow-md transition-all cursor-pointer">
                              <FaPen className="text-[12px]" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleView(dt.id)}
                            className="text-primary hover:bg-primary hover:text-white px-2 py-1 rounded shadow-md transition-all cursor-pointer"
                          >
                            <FaEye className="text-[12px]" />
                          </button>
                          <button
                            onClick={() => {
                              setselectedTripId(dt.id);
                              setIsOpen(true);
                            }}
                            className="text-red-900 hover:text-white hover:bg-red-900 px-2 py-1 rounded shadow-md transition-all cursor-pointer"
                          >
                            <FaTrashAlt className="text-[12px]" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
      {/* Delete modal */}
      <div className="flex justify-center items-center">
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-[#000000ad] z-50">
            <div className="relative bg-white rounded-lg shadow-lg p-6 w-72 max-w-sm border border-gray-300">
              <button
                onClick={toggleModal}
                className="text-2xl absolute top-2 right-2 text-white bg-red-500 hover:bg-red-700 cursor-pointer rounded-sm"
              >
                <IoMdClose />
              </button>

              <div className="flex justify-center mb-4 text-red-500 text-4xl">
                <FaTrashAlt />
              </div>
              <p className="text-center text-gray-700 font-medium mb-6">
                আপনি কি ট্রিপটি ডিলিট করতে চান?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={toggleModal}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-primary hover:text-white cursor-pointer"
                >
                  না
                </button>
                <button
                  onClick={() => handleDelete(selectedTripId)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 cursor-pointer"
                >
                  হ্যাঁ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* get trip information by id */}
      {viewModalOpen && selectedTrip && (
        <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-[#000000ad] z-50">
          <div className="w-4xl p-5 bg-gray-100 rounded-xl mt-10">
            <h3 className="text-primary font-semibold">ট্রিপের তথ্য</h3>
            <div className="mt-5">
              <ul className="flex border border-gray-300">
                <li className="w-[428px] flex text-primary text-sm font-semibold px-3 py-2 border-r border-gray-300">
                  <p className="w-48">ট্রিপের সময়</p>{" "}
                  <p>
                    {new Date(
                      `1970-01-01T${selectedTrip.trip_time}`
                    ).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </li>
                <li className="w-[428px] flex text-primary text-sm font-semibold px-3 py-2">
                  <p className="w-48">ট্রিপের তারিখ</p>{" "}
                  <p>{selectedTrip.trip_date}</p>
                </li>
              </ul>
              <ul className="flex border-b border-r border-l border-gray-300">
                <li className="w-[428px] flex text-primary text-sm font-semibold px-3 py-2 border-r border-gray-300">
                  <p className="w-48">লোড পয়েন্ট</p>{" "}
                  <p>{selectedTrip.load_point}</p>
                </li>
                <li className="w-[428px] flex text-primary text-sm font-semibold px-3 py-2">
                  <p className="w-48">আনলোড পয়েন্ট</p>{" "}
                  <p>{selectedTrip.unload_point}</p>
                </li>
              </ul>
              <ul className="flex border-b border-r border-l border-gray-300">
                <li className="w-[428px] flex text-primary text-sm font-semibold px-3 py-2 border-r border-gray-300">
                  <p className="w-48">ড্রাইভারের নাম</p>{" "}
                  <p>{selectedTrip.driver_name}</p>
                </li>
                <li className="w-[428px] flex text-primary text-sm font-semibold px-3 py-2">
                  <p className="w-48">ড্রাইভারের মোবাইল</p>{" "}
                  <p>{selectedTrip.driver_contact}</p>
                </li>
              </ul>
              <ul className="flex border-b border-r border-l border-gray-300">
                <li className="w-[428px] flex text-primary text-sm font-semibold px-3 py-2 border-r border-gray-300">
                  <p className="w-48">ড্রাইভারের কমিশন</p>{" "}
                  <p>{selectedTrip.driver_percentage}</p>
                </li>
                <li className="w-[428px] flex text-primary text-sm font-semibold px-3 py-2 border-r border-gray-300">
                  <p className="w-48">তেলের মূল্য</p>{" "}
                  <p>{selectedTrip.trip_price}</p>
                </li>
              </ul>
              <ul className="flex border-b border-r border-l border-gray-300">
                <li className="w-[428px] flex text-primary text-sm font-semibold px-3 py-2 border-r border-gray-300">
                  <p className="w-48">গ্যাসের মূল্য</p>{" "}
                  <p>{selectedTrip.gas_price}</p>
                </li>
                <li className="w-[428px] flex text-primary text-sm font-semibold px-3 py-2 border-r border-gray-300">
                  <p className="w-48">গাড়ির নম্বর</p>{" "}
                  <p>{selectedTrip.vehicle_number}</p>
                </li>
              </ul>
              <ul className="flex border-b border-r border-l border-gray-300">
                <li className="w-[428px] flex text-primary text-sm font-semibold px-3 py-2 border-r border-gray-300">
                  <p className="w-48">অন্যান্য খরচ</p>{" "}
                  <p>{selectedTrip.other_expenses}</p>
                </li>
                <li className="w-[428px] flex text-primary text-sm font-semibold px-3 py-2 border-r border-gray-300">
                  <p className="w-48">ট্রিপের খরচ</p>{" "}
                  <p>
                    {(
                      Number(selectedTrip.trip_price) +
                      Number(selectedTrip.gas_price) +
                      Number(selectedTrip.other_expenses) +
                      Number(selectedTrip.driver_percentage)
                    ).toFixed(2)}{" "}
                  </p>
                </li>
              </ul>
              <ul className="flex border-b border-r border-l border-gray-300">
                <li className="w-[428px] flex text-primary text-sm font-semibold px-3 py-2 border-r border-gray-300">
                  <p className="w-48">ট্রিপের ভাড়া</p>{" "}
                  <p>{selectedTrip.trip_price}</p>
                </li>
                <li className="w-[428px] flex text-primary text-sm font-semibold px-3 py-2 border-r border-gray-300">
                  <p className="w-48">কাস্টমারের নাম</p>{" "}
                  <p>{selectedTrip.customer}</p>
                </li>
              </ul>
              <div className="flex justify-end mt-10">
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="text-white bg-primary py-1 px-2 rounded-md cursor-pointer hover:bg-secondary"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default TripList;
