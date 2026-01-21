import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { RiDeleteBinLine } from "react-icons/ri";
import {
  SearchOutlined,
  PrinterOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import BookingInvoice from "../components/BookingInvoice";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { FaPlus, FaTrashAlt } from "react-icons/fa";

const Booking = () => {
  const [bookings, setBooking] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const printRef = useRef();

  // fetch data
  useEffect(() => {
    axios
      .get("https://rent.demo.tramessy.com/backend/api/booking")
      .then((response) => {
        if (response.data.status === "success") {
          setBooking(response.data.data);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching driver data:", error);
        setLoading(false);
      });
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Invoice Print",
    onAfterPrint: () => setSelectedInvoice(null),
    onPrintError: (error) => console.error("Print error:", error),
  });

  const handlePrintClick = (record) => {
    setSelectedInvoice(record);
    setTimeout(() => handlePrint(), 100);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://rent.demo.tramessy.com/backend/api/booking/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete booking");
      }
      setBooking((prev) => prev.filter((driver) => driver.id !== id));
      toast.success("বুকিং সফলভাবে ডিলিট হয়েছে", {
        position: "top-right",
        autoClose: 3000,
      });
      setSelectedDriverId(null);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("ডিলিট করতে সমস্যা হয়েছে!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    setShowModal(false);
  };

  const filteredBookings = bookings.filter((booking) =>
    Object.values(booking).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  if (loading) return <p className="text-center mt-16">Loading booking...</p>;

  return (
    <div className="">
      <Toaster />
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">বুকিং তালিকা</h2>
          <Link to="/AddBooking">
            <button className="bg-gradient-to-r from-[#11375B] to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-4 py-1 rounded-md shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 cursor-pointer">
              <FaPlus /> নতুন বুকিং
            </button>
          </Link>
        </div>

        <div className="flex justify-end mb-4 gap-2">
          <input
            type="text"
            placeholder="বুকিং খুঁজুন..."
            className="border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-[#11375B] text-white px-4 py-2 rounded-md">
            <SearchOutlined />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-1">SL</th>
                <th className="border p-1">কাস্টমারের নাম</th>
                <th className="border p-1">বুকিং তারিখ</th>
                <th className="border p-1">মোবাইল</th>
                <th className="border p-1">গাড়ির নাম্বার</th>
                <th className="border p-1">পিকআপ পয়েন্ট</th>
                <th className="border p-1">সময়</th>
                <th className="border p-1">ড্রপ পয়েন্ট</th>
                <th className="border p-1">শুরুর তারিখ</th>
                <th className="border p-1">শেষ তারিখ</th>
                <th className="border p-1">অ্যাডভান্স</th>
                <th className="border p-1">মোট ভাড়া</th>
                <th className="border p-1">স্ট্যাটাস</th>
                <th className="border p-1">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking, index) => (
                <tr key={booking.id} className="text-center">
                  <td className="border p-1">{index + 1}</td>
                  <td className="border p-1">{booking.customer_name}</td>
                  <td className="border p-1">{booking.booking_date}</td>
                  <td className="border p-1">{booking.phone}</td>
                  <td className="border p-1">{booking.car_number}</td>
                  <td className="border p-1">{booking.pickup_point}</td>
                  <td className="border p-1">{booking.pickup_time}</td>
                  <td className="border p-1">{booking.drop_point}</td>
                  <td className="border p-1">{booking.start_date}</td>
                  <td className="border p-1">{booking.end_date}</td>
                  <td className="border p-1">{booking.advanced}</td>
                  <td className="border p-1">{booking.total_amount}</td>
                  <td className="border p-1">
                    <span
                      className={`p-1 rounded-full text-white text-xs ${
                        booking.status === "Confirmed"
                          ? "bg-green-500"
                          : "bg-orange-500"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="border p-1 space-x-1">
                    <Link
                      to={`/UpdateBooking/${booking.id}`}
                      className="text-yellow-500 cursor-pointer"
                    >
                      <EditOutlined />
                    </Link>
                    <button
                      onClick={() => handlePrintClick(booking)}
                      className="text-green-600 cursor-pointer"
                    >
                      <PrinterOutlined />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDriverId(booking.id);

                        setShowModal(true);
                      }}
                      className="text-red-500 cursor-pointer"
                    >
                      <RiDeleteBinLine />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Hidden Print Component */}
        <div className="hidden">
          {selectedInvoice && (
            <BookingInvoice ref={printRef} data={selectedInvoice} />
          )}
        </div>

        {/* Delete modal */}
        <div className="flex justify-center items-center">
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-[#000000ad] z-50">
              <div className="relative bg-white rounded-lg shadow-lg p-6 w-72 max-w-sm border border-gray-300">
                <button
                  onClick={() => setShowModal(false)}
                  className="text-2xl absolute top-2 right-2 text-white bg-red-500 hover:bg-red-700 cursor-pointer rounded-sm"
                >
                  <IoMdClose />
                </button>
                <div className="flex justify-center mb-4 text-red-500 text-4xl">
                  <FaTrashAlt />
                </div>
                <p className="text-center text-gray-700 font-medium mb-6">
                  আপনি কি বুকিংটি ডিলিট করতে চান?
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-primary hover:text-white cursor-pointer"
                  >
                    না
                  </button>
                  <button
                    onClick={() => handleDelete(selectedDriverId)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 cursor-pointer"
                  >
                    হ্যাঁ
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;
