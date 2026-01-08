import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdOutlineArrowDropDown } from "react-icons/md";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FiCalendar } from "react-icons/fi";
import Select from "react-select";
import BtnSubmit from "../components/Button/BtnSubmit";
import { useNavigate } from "react-router-dom";

const AddBooking = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
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
      for (const key in data) {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      }
      const response = await axios.post(
        "https://rent.demo.tramessy.com/backend/api/booking",
        formData
      );
      const resData = response.data;

      if (resData.status === "Success") {
        toast.success("তথ্য সফলভাবে সংরক্ষণ হয়েছে!", {
          position: "top-right",
        });
        reset();
        navigate("/booking");
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
                বুকিং তারিখ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("booking_date", { required: true })}
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
                ক্যাটাগরি <span className="text-red-500">*</span>
              </label>
              <select
                {...register("category", { required: true })}
                className="mt-1 w-full text-gray-500 text-sm border border-gray-300 bg-white p-2 rounded appearance-none outline-none"
              >
                <option value="">ক্যাটাগরি...</option>
                <option value="কার">কার</option>
                <option value="ট্যাক্সি">ট্যাক্সি</option>
                <option value="বাস">বাস</option>
                <option value="ড্রাইভার">ড্রাইভার</option>
                <option value="ডেলিভার">ডেলিভার</option>
              </select>
              {errors.category && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
              <MdOutlineArrowDropDown className="absolute top-[35px] right-2 pointer-events-none text-xl text-gray-500" />
            </div>
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                গাড়ির ধরন <span className="text-red-500">*</span>
              </label>
              <select
                {...register("vehicle_type", { required: true })}
                className="mt-1 w-full text-gray-500 text-sm border border-gray-300 bg-white p-2 rounded appearance-none outline-none"
              >
                <option value="">গাড়ির ধরন...</option>
                <option value="সেডান">সেডান</option>
                <option value="স্ট্যান্ডার্ড">স্ট্যান্ডার্ড</option>
                <option value="এক্স নোহা">এক্স নোহা</option>
                <option value="হাইয়েস">হাইয়েস</option>
              </select>
              {errors.vehicle_type && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
              <MdOutlineArrowDropDown className="absolute top-[35px] right-2 pointer-events-none text-xl text-gray-500" />
            </div>
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                ট্রিপের ধরন <span className="text-red-500">*</span>
              </label>
              <select
                {...register("trip_type", { required: true })}
                className="mt-1 w-full text-gray-500 text-sm border border-gray-300 bg-white p-2 rounded appearance-none outline-none"
              >
                <option value="">ট্রিপের ধরন...</option>
                <option value="ঘণ্টায়">ঘণ্টায় </option>
                <option value="দৈনিক">দৈনিক</option>
                <option value="মাসিক">মাসিক</option>
                <option value="ওয়ান ওয়ে">ওয়ান ওয়ে</option>
                <option value="সিটি ট্রিপ">সিটি ট্রিপ</option>
              </select>
              {errors.trip_type && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
              <MdOutlineArrowDropDown className="absolute top-[35px] right-2 pointer-events-none text-xl text-gray-500" />
            </div>
          </div>

          <div className="md:flex justify-between gap-3">
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                পেমেন্ট এর ধরন <span className="text-red-500">*</span>
              </label>
              <select
                {...register("payment_method", { required: true })}
                className="mt-1 w-full text-gray-500 text-sm border border-gray-300 bg-white p-2 rounded appearance-none outline-none"
              >
                <option value="">পেমেন্ট এর ধরন...</option>
                <option value="বিকাশ">বিকাশ </option>
                <option value="নগদ">নগদ</option>
                <option value="ব্যাংক">ব্যাংক</option>
                <option value="ক্যাশ">ক্যাশ</option>
              </select>
              {errors.payment_method && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
              <MdOutlineArrowDropDown className="absolute top-[35px] right-2 pointer-events-none text-xl text-gray-500" />
            </div>
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                গাড়ির নাম <span className="text-red-500">*</span>
              </label>
              <Controller
                name="car_name"
                control={control}
                rules={{ required: true }}
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
                গাড়ির নাম্বার <span className="text-red-500">*</span>
              </label>
              <Controller
                name="car_number"
                control={control}
                rules={{ required: true }}
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
                পিকআপ পয়েন্ট <span className="text-red-500">*</span>
              </label>
              <input
                {...register("pickup_point", { required: true })}
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
                পিকআপ এর সময় <span className="text-red-500">*</span>
              </label>
              <input
                {...register("pickup_time", { required: true })}
                type="text"
                placeholder="পিকআপ এর সময়..."
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
              {errors.pickup_time && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
            </div>
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                ড্রপ পয়েন্ট <span className="text-red-500">*</span>
              </label>
              <input
                {...register("drop_point", { required: true })}
                type="text"
                placeholder="ড্রপ পয়েন্ট..."
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
              {errors.drop_point && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
            </div>
          </div>
          <div className="md:flex justify-between gap-3">
            <div className="w-full">
              <label className="text-primary text-sm font-semibold">
                শুরুর তারিখ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("start_date", { required: true })}
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
                শেষ তারিখ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("end_date", { required: true })}
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
                অ্যাডভান্স পরিশোধ (৳) <span className="text-red-500">*</span>
              </label>
              <input
                {...register("advanced", { required: true })}
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
                টোটাল ভাড়া (৳) <span className="text-red-500">*</span>
              </label>
              <input
                {...register("total_amount", { required: true })}
                type="number"
                placeholder="টোটাল ভাড়া (৳)..."
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
              {errors.total_amount && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
            </div>
          </div>
          <div className="md:flex justify-between gap-3">
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                কাস্টমারের নাম <span className="text-red-500">*</span>
              </label>
              <input
                {...register("customer_name", { required: true })}
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
                মোবাইল <span className="text-red-500">*</span>
              </label>
              <input
                {...register("phone", { required: true })}
                type="text"
                placeholder="মোবাইল..."
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
              {errors.phone && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
            </div>
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                ইমেইল <span className="text-red-500">*</span>
              </label>
              <input
                {...register("email", { required: true })}
                type="text"
                placeholder="ইমেইল..."
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
              {errors.email && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
            </div>
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                স্ট্যাটাস <span className="text-red-500">*</span>
              </label>
              <select
                {...register("status", { required: true })}
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

export default AddBooking;
