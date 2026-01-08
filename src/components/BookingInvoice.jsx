import dayjs from "dayjs";
import { forwardRef } from "react";
import parklineLogo from "../assets/logo.png";
const BookingInvoice = forwardRef(({ data }, ref) => {
  const {
    customer_name,
    phone,
    car_name,
    start_date,
    end_date,
    status,
    advanced,
    total_amount,
  } = data;

  const dueAmount = total_amount - advanced;
  const currentDate = new Date().toLocaleDateString("en-GB");

  return (
    <div
      ref={ref}
      id="invoice"
      className="max-w-3xl mx-auto bg-white shadow-lg"
      style={{ fontFamily: "'Inter', 'Noto Sans Bengali', Arial, sans-serif" }}
    >
      {/* Compact Header */}
      <div className=" text-black p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <img src={parklineLogo} alt="" />
            </div>
            <div>
              <h1 className="text-xl font-bold">রেন্ট এ কার</h1>
              <p className="text-gray-600 text-xs">গাড়ি ভাড়া সেবা</p>
            </div>
          </div>
          <div className="text-right text-sm">
            <p className="text-black">Invoice Date</p>
            <p className="text-gray-600 font-bold">{currentDate}</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-3 text-xs">
          <div>
            <p className="text-black font-semibold">Office:</p>
            <p className="text-gray-600">123 Motijheel, Dhaka-1000</p>
          </div>
          <div>
            <p className="text-black font-semibold">Contact:</p>
            <p className="text-gray-600">+880-2-123456789</p>
          </div>
          <div>
            <p className="text-black font-semibold">License:</p>
            <p className="text-gray-600">TL: 123456</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              গাড়ি ভাড়ার ইনভয়েস
            </h2>
            <p className="text-sm text-gray-600">
              #INV-{Date.now().toString().slice(-6)}
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="text-gray-600">Booking Date</p>
            <p className="font-semibold">{currentDate}</p>
          </div>
        </div>

        {/* Customer & Service Info - Compact */}
        <div className="grid grid-cols-2 gap-4 mb-4 bg-gray-50">
          <div className=" p-3 rounded">
            <h3 className="font-semibold text-gray-800 mb-2 text-sm">
              গ্রাহকের তথ্য
            </h3>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{customer_name}</p>
              <p className="text-gray-600">{phone}</p>
            </div>
          </div>

          <div className=" p-3 rounded">
            <h3 className="font-semibold text-gray-800 mb-2 text-sm">
              ভাড়ার বিবরণ
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">গাড়ির নাম:</span>
                <span className="font-medium">{car_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">শুরুর তারিখ:</span>
                <span className="font-medium">{start_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">শেষ তারিখ:</span>
                <span className="font-medium">{end_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">স্ট্যাটাস:</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    status === "সম্পন্ন"
                      ? "bg-green-100 text-green-800"
                      : status === "চলমান"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Invoice Table */}
        <div className="mb-4">
          <div className="bg-white border border-gray-200 rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-800">
                    বিবরণ
                  </th>
                  <th className="px-3 py-2 text-center font-semibold text-gray-800">
                    সময়কাল
                  </th>
                  <th className="px-3 py-2 text-right font-semibold text-gray-800">
                    পরিমাণ
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  <td className="px-3 py-2">
                    <div>
                      <p className="font-medium text-gray-800">
                        গাড়ি ভাড়া - {car_name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {start_date} থেকে {end_date}
                      </p>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    {(() => {
                      const start = dayjs(start_date, "DD-MM-YYYY");
                      const end = dayjs(end_date, "DD-MM-YYYY");
                      const diffDays = end.diff(start, "day") + 1; // include both days
                      return `${diffDays} দিন`;
                    })()}
                  </td>
                  <td className="px-3 py-2 text-right font-semibold">
                    ৳{total_amount?.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Compact Payment Summary */}
        <div className="flex justify-end mb-4">
          <div className="w-full max-w-sm">
            <div className="bg-gray-50 p-3 rounded">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between font-semibold">
                  <span>মোট ভাড়া:</span>
                  <span>৳{total_amount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>অ্যাডভান্স:</span>
                  <span>৳{advanced?.toLocaleString()}</span>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between font-bold text-lg">
                  <span>বাকি পরিমাণ:</span>
                  <span className="text-gray-700">
                    ৳{dueAmount?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Footer */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          {/* <div className="bg-blue-50 p-3 rounded">
            <h3 className="font-semibold text-gray-800 mb-2">পেমেন্ট তথ্য</h3>
            <p>
              <strong>ব্যাংক:</strong> ডাচ বাংলা ব্যাংক
            </p>
            <p>
              <strong>একাউন্ট:</strong> 1234567890
            </p>
            <p>
              <strong>মোবাইল:</strong> 01712345678
            </p>
          </div> */}

          <div className="bg-yellow-50 p-3 rounded">
            <h3 className="font-semibold text-gray-800 mb-2">শর্তাবলী</h3>
            <p>• ভ্রমণের আগে পেমেন্ট সম্পন্ন করতে হবে</p>
            <p>• বৈধ আইডি প্রয়োজন</p>
            <p>• বাতিলের জন্য চার্জ প্রযোজ্য</p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200 text-center">
          <p className="font-semibold text-gray-800">ডেভেলপ বাই ট্রামেসি</p>
          <p className="text-xs text-gray-600 mt-1">
            যোগাযোগ: +880 1627-355382
          </p>
        </div>
      </div>
    </div>
  );
});

export default BookingInvoice;
