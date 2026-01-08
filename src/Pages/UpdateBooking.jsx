import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdOutlineArrowDropDown } from "react-icons/md";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FiCalendar } from "react-icons/fi";
import Select from "react-select";
import BtnSubmit from "../components/Button/BtnSubmit";
import { useLoaderData } from "react-router-dom";
const UpdateBooking = () => {
  // load data
  const updateBookingLoaderData = useLoaderData();
  const {
    id,
    booking_date,
    start_date,
    end_date,
    car_name,
    status,
    advanced,
    customer_name,
    phone,
    total_amount,
    car_number,
    pickup_point,
    drop_point,
    pickup_time,
  } = updateBookingLoaderData.data;
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const bookingDateRef = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  // car name / registration number
  const [vehicles, setVehicles] = useState([]);
  useEffect(() => {
    fetch("https://rent.demo.tramessy.com/backend/api/vehicle")
      .then((response) => response.json())
      .then((data) => setVehicles(data.data))
      .catch((error) => console.error("Error fetching vehicle data:", error));
  }, []);

  const vehicleOptions = vehicles.map((vehicle) => ({
    value: vehicle.vehicle_name,
    label: vehicle.vehicle_name,
  }));
  const [vehicleNumber, setVehicleNumber] = useState([]);
  useEffect(() => {
    fetch("https://rent.demo.tramessy.com/backend/api/vehicle")
      .then((response) => response.json())
      .then((data) => setVehicleNumber(data.data))
      .catch((error) => console.error("Error fetching vehicle data:", error));
  }, []);

  const vehicleNumberOptions = vehicleNumber.map((vehicle) => ({
    value: `${vehicle.registration_zone}-${vehicle.registration_serial}-${vehicle.registration_number}`,
    label: `${vehicle.registration_zone}-${vehicle.registration_serial}-${vehicle.registration_number}`,
  }));

  // post data on server
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // Append fields
      for (const key in data) {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      }

      // Debug: log all data being sent
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axios.post(
        `https://rent.demo.tramessy.com/backend/api/booking/${id}`,
        formData
      );

      const resData = response.data;
      if (resData.status === "success") {
        toast.success("তথ্য সফলভাবে সংরক্ষণ হয়েছে!", {
          position: "top-right",
        });
      } else {
        toast.error("সার্ভার ত্রুটি: " + (resData.message || "অজানা সমস্যা"));
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message || error.message || "Unknown error";
      toast.error("সার্ভার ত্রুটি: " + errorMessage);
    }
  };

  return (
    <div className="mt-10">
      <Toaster />
      <h3 className="px-6 py-2 bg-primary text-white font-semibold rounded-t-md">
        নতুন বুকিং
      </h3>
      <div className="mx-auto p-6 bg-gray-100 rounded-md shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="md:flex justify-between gap-3">
            <div className="w-full">
              <label className="text-primary text-sm font-semibold">
                বুকিং তারিখ
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("booking_date")}
                  defaultValue={booking_date}
                  ref={(e) => {
                    register("booking_date").ref(e);
                    bookingDateRef.current = e;
                  }}
                  className="remove-date-icon mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none pr-10"
                />
                {errors.booking_date && (
                  <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
                )}
                <span className="py-[11px] absolute right-0 px-3 top-[22px] transform -translate-y-1/2 bg-primary rounded-r">
                  <FiCalendar
                    className="text-white cursor-pointer"
                    onClick={() => bookingDateRef.current?.showPicker?.()}
                  />
                </span>
              </div>
            </div>
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                কাস্টমারের নাম
              </label>
              <input
                {...register("customer_name")}
                defaultValue={customer_name}
                type="text"
                placeholder="কাস্টমারের নাম..."
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
              {errors.customer_name && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
            </div>
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                মোবাইল
              </label>
              <input
                {...register("phone")}
                defaultValue={phone}
                type="text"
                placeholder="মোবাইল..."
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
              {errors.phone && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
            </div>
          </div>
          <div className="md:flex justify-between gap-3">
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                গাড়ির নাম
              </label>
              <Controller
                name="car_name"
                control={control}
                defaultValue={car_name}
                render={({ field: { onChange, value, ref } }) => (
                  <Select
                    inputRef={ref}
                    value={
                      vehicleOptions.find((c) => c.value === value) || null
                    }
                    onChange={(val) => onChange(val ? val.value : "")}
                    options={vehicleOptions}
                    placeholder="গাড়ির নাম..."
                    className="mt-1 text-sm"
                    classNamePrefix="react-select"
                    isClearable
                  />
                )}
              />

              {errors.car_name && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
            </div>
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                গাড়ির নাম্বার
              </label>
              <Controller
                name="car_number"
                control={control}
                defaultValue={car_number}
                render={({ field: { onChange, value, ref } }) => (
                  <Select
                    inputRef={ref}
                    value={
                      vehicleNumberOptions.find((c) => c.value === value) ||
                      null
                    }
                    onChange={(val) => onChange(val ? val.value : "")}
                    options={vehicleNumberOptions}
                    placeholder="গাড়ির নাম্বার..."
                    className="mt-1 text-sm"
                    classNamePrefix="react-select"
                    isClearable
                  />
                )}
              />

              {errors.car_number && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
            </div>
          </div>

          <div className="md:flex justify-between gap-3">
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                পিকআপ পয়েন্ট
              </label>
              <input
                {...register("pickup_point")}
                defaultValue={pickup_point}
                type="text"
                placeholder="পিকআপ পয়েন্ট..."
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
              {errors.pickup_point && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
            </div>
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                ড্রপ পয়েন্ট
              </label>
              <input
                {...register("drop_point")}
                defaultValue={drop_point}
                type="text"
                placeholder="ড্রপ পয়েন্ট..."
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
              {errors.drop_point && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
            </div>
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                পিকআপ এর সময়
              </label>
              <input
                {...register("pickup_time")}
                defaultValue={pickup_time}
                type="text"
                placeholder="পিকআপ এর সময়..."
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
              {errors.pickup_time && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
            </div>
          </div>
          <div className="md:flex justify-between gap-3">
            <div className="w-full">
              <label className="text-primary text-sm font-semibold">
                শুরুর তারিখ
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("start_date")}
                  defaultValue={start_date}
                  ref={(e) => {
                    register("start_date").ref(e);
                    startDateRef.current = e;
                  }}
                  className="remove-date-icon mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none pr-10"
                />
                {errors.start_date && (
                  <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
                )}
                <span className="py-[11px] absolute right-0 px-3 top-[22px] transform -translate-y-1/2 bg-primary rounded-r">
                  <FiCalendar
                    className="text-white cursor-pointer"
                    onClick={() => startDateRef.current?.showPicker?.()}
                  />
                </span>
              </div>
            </div>
            <div className="w-full">
              <label className="text-primary text-sm font-semibold">
                শেষ তারিখ
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("end_date")}
                  defaultValue={end_date}
                  ref={(e) => {
                    register("end_date").ref(e);
                    endDateRef.current = e;
                  }}
                  className="remove-date-icon mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none pr-10"
                />
                {errors.end_date && (
                  <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
                )}
                <span className="py-[11px] absolute right-0 px-3 top-[22px] transform -translate-y-1/2 bg-primary rounded-r">
                  <FiCalendar
                    className="text-white cursor-pointer"
                    onClick={() => endDateRef.current?.showPicker?.()}
                  />
                </span>
              </div>
            </div>
          </div>
          <div className="md:flex justify-between gap-3">
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                অ্যাডভান্স পরিশোধ (৳)
              </label>
              <input
                {...register("advanced")}
                defaultValue={advanced}
                type="text"
                placeholder="অ্যাডভান্স পরিশোধ (৳)..."
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
              {errors.advanced && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
            </div>
            <div className="w-full">
              <label className="text-primary text-sm font-semibold">
                টোটাল ভাড়া (৳)
              </label>
              <input
                {...register("total_amount")}
                defaultValue={total_amount}
                type="number"
                placeholder="টোটাল ভাড়া (৳)..."
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
              {errors.total_amount && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
            </div>
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                স্ট্যাটাস
              </label>
              <select
                {...register("status")}
                defaultValue={status}
                className="mt-1 w-full text-gray-500 text-sm border border-gray-300 bg-white p-2 rounded appearance-none outline-none"
              >
                <option value="">স্ট্যাটাস</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
              </select>
              {errors.status && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
              <MdOutlineArrowDropDown className="absolute top-[35px] right-2 pointer-events-none text-xl text-gray-500" />
            </div>
          </div>

          <div className="mt-6">
            <BtnSubmit>সাবমিট করুন</BtnSubmit>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBooking;
