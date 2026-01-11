import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useForm, Controller } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { FiCalendar } from "react-icons/fi";
import Select from "react-select";
import BtnSubmit from "../components/Button/BtnSubmit";
const AddTripForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const tripDateRef = useRef(null);
  const commision = parseFloat(watch("driver_percentage") || 0);
  const fuel = parseFloat(watch("fuel_price") || 0);
  const gas = parseFloat(watch("gas_price") || 0);
  const totalDamarage = parseFloat(watch("demarage") || 0);
  const other = parseFloat(watch("other_expenses") || 0);
  const total = commision + fuel + gas + totalDamarage + other;

  // driver name
  const [drivers, setDrivers] = useState([]);
  // car name / registration number
  const [vehicles, setVehicles] = useState([]);
  useEffect(() => {
    fetch("https://pochao.tramessy.com/backend/api/vehicle")
      .then((response) => response.json())
      .then((data) => setVehicles(data.data))
      .catch((error) => console.error("Error fetching driver data:", error));
  }, []);

  const vehicleOptions = vehicles.map((vehicle) => ({
    value: vehicle.registration_number,
    label: vehicle.registration_number,
  }));
  // driver name
  useEffect(() => {
    fetch("https://pochao.tramessy.com/backend/api/driver")
      .then((response) => response.json())
      .then((data) => setDrivers(data.data))
      .catch((error) => console.error("Error fetching driver data:", error));
  }, []);

  const driverOptions = drivers.map((driver) => ({
    value: driver.name,
    label: driver.name,
    contact: driver.contact,
  }));
  // post data on server
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }
      const response = await axios.post(
        "https://pochao.tramessy.com/backend/api/trip",
        formData
      );
      const resData = response.data;
      if (resData.status === "success") {
        toast.success("ট্রিপ সফলভাবে সংরক্ষণ হয়েছে!", {
          position: "top-right",
        });
        reset();
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
      <h3 className="px-6 py-2 bg-primary text-white font-semibold rounded-t-md">
        ট্রিপ যোগ করুন
      </h3>
      <div className="mx-auto p-6 bg-gray-100 rounded-md shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Toaster position="top-center" reverseOrder={false} />
          {/*  */}
          <div className="border border-gray-300 p-3 md:p-5 rounded-md">
            <h5 className="text-primary font-semibold text-center md:pb-5">
              <span className="py-2 border-b-2 border-primary">
                ট্রিপ এবং গন্তব্য সেকশন
              </span>
            </h5>
            <div className="mt-5 md:mt-1 md:flex justify-between gap-3">
              <div className="w-full">
                <label className="text-primary text-sm font-semibold">
                  তারিখ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    {...register("trip_date", { required: true })}
                    ref={(e) => {
                      register("trip_date").ref(e);
                      tripDateRef.current = e;
                    }}
                    className="remove-date-icon mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none pr-10"
                  />
                  {errors.trip_date && (
                    <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
                  )}
                  <span className="py-[11px] absolute right-0 px-3 top-[22px] transform -translate-y-1/2 bg-primary rounded-r">
                    <FiCalendar
                      className="text-white cursor-pointer"
                      onClick={() => tripDateRef.current?.showPicker?.()}
                    />
                  </span>
                </div>
              </div>
              <div className="mt-2 md:mt-0 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  ট্রিপের সময় <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("trip_time", { required: true })}
                  type="text"
                  placeholder="ট্রিপের সময়..."
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
                {errors.trip_time && (
                  <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
                )}
              </div>
            </div>
            {/*  */}
            <div className="md:flex justify-between gap-3">
              <div className="mt-2 md:mt-1 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  পিকআপ পয়েন্ট <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("load_point", { required: true })}
                  type="text"
                  placeholder="পিকআপ পয়েন্ট..."
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
                {errors.load_point && (
                  <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
                )}
              </div>
              <div className="mt-2 md:mt-1 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  ড্রপ পয়েন্ট <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("unload_point", { required: true })}
                  type="text"
                  placeholder="ড্রপ পয়েন্ট..."
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
                {errors.unload_point && (
                  <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
                )}
              </div>
            </div>
          </div>
          {/*  */}
          <div className="border border-gray-300 p-5 rounded-md">
            <h5 className="text-primary font-semibold text-center pb-5">
              <span className="py-2 border-b-2 border-primary">
                গাড়ি এবং ড্রাইভারের তথ্য
              </span>
            </h5>
            <div className="md:flex justify-between gap-3">
              <div className="mt-2 md:mt-1 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  গাড়ির নম্বর <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="vehicle_number"
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
                      placeholder="গাড়ির নম্বর নির্বাচন করুন..."
                      className="mt-1 text-sm"
                      classNamePrefix="react-select"
                      isClearable
                    />
                  )}
                />
                {errors.vehicle_number && (
                  <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
                )}
              </div>
              <div className="mt-1 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  ড্রাইভারের নাম <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="driver_name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value, ref } }) => (
                    <Select
                      inputRef={ref}
                      value={
                        driverOptions.find(
                          (option) => option.value === value
                        ) || null
                      }
                      onChange={(selectedOption) => {
                        const selectedName = selectedOption?.value || "";
                        onChange(selectedName);

                        // set mobile number
                        const matchedDriver = drivers.find(
                          (d) => d.name === selectedName
                        );
                        setValue(
                          "driver_contact",
                          matchedDriver?.contact || ""
                        );
                      }}
                      options={driverOptions}
                      placeholder="ড্রাইভারের নাম নির্বাচন করুন..."
                      className="mt-1 text-sm"
                      classNamePrefix="react-select"
                      isClearable
                    />
                  )}
                />
                {errors.driver_name && (
                  <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
                )}
              </div>
              <div className="mt-2 md:mt-1 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  ড্রাইভারের মোবাইল <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("driver_contact", { required: true })}
                  type="number"
                  placeholder="ড্রাইভারের মোবাইল..."
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
                {errors.driver_contact && (
                  <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
                )}
              </div>
            </div>
          </div>
          {/*  */}
          <div className="border border-gray-300 p-5 rounded-md">
            <h5 className="text-primary font-semibold text-center pb-5">
              <span className="py-2 border-b-2 border-primary">চলমান খরচ</span>
            </h5>
            <div className="md:flex justify-between gap-3">
              <div className="mt-2 md:mt-1 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  ড্রাইভারের কমিশন <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("driver_percentage", { required: true })}
                  type="number"
                  placeholder="ড্রাইভারের কমিশন..."
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
                {errors.driver_percentage && (
                  <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
                )}
              </div>
              <div className="w-full relative">
                <label className="text-primary text-sm font-semibold">
                  তেলের মূল্য
                </label>
                <input
                  {...register("fuel_price")}
                  type="text"
                  placeholder="তেলের মূল্য..."
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
              </div>
              <div className="mt-2 md:mt-0 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  গ্যাসের মূল্য
                </label>
                <input
                  {...register("gas_price")}
                  type="text"
                  placeholder="গ্যাসের মূল্য..."
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
              </div>
            </div>
            <div className="md:flex justify-between gap-3">
              <div className="mt-2 md:mt-1 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  অন্যান্য খরচ
                </label>
                <input
                  {...register("other_expenses")}
                  type="text"
                  placeholder="অন্যান্য খরচ..."
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
              </div>
              <div className="mt-2 md:mt-1 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  ওয়েটিং চার্জ
                </label>
                <input
                  {...register("demarage")}
                  type="number"
                  placeholder="ওয়েটিং চার্জ..."
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
                {errors.demarage && (
                  <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
                )}
              </div>
              <div className="mt-1 w-full">
                <label className="text-primary text-sm font-semibold">
                  ট্রিপের খরচ
                </label>
                <input
                  readOnly
                  value={total}
                  placeholder="ট্রিপের খরচ..."
                  className="cursor-not-allowed mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-gray-200 outline-none"
                />
              </div>
            </div>
          </div>
          {/*  */}
          <div className="border border-gray-300 p-5 rounded-md">
            <h5 className="text-primary font-semibold text-center pb-5">
              <span className="py-2 border-b-2 border-primary">
                কাস্টমার এবং পেমেন্ট তথ্য
              </span>
            </h5>
            <div className="md:flex justify-between gap-3">
              <div className="mt-2 md:mt-1 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  কাস্টমারের নাম <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("customer", { required: true })}
                  type="text"
                  placeholder="কাস্টমারের নাম..."
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
                {errors.customer && (
                  <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
                )}
              </div>
              <div className="mt-2 md:mt-1 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  কাস্টমারের মোবাইল <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("customer_mobile", { required: true })}
                  type="number"
                  placeholder="কাস্টমারের মোবাইল..."
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
                {errors.customer_mobile && (
                  <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
                )}
              </div>
              <div className="mt-2 md:mt-1 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  ট্রিপের ভাড়া <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("trip_price", { required: true })}
                  type="text"
                  placeholder="ট্রিপের ভাড়া..."
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
                {errors.trip_price && (
                  <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
                )}
              </div>
              <div className="mt-2 md:mt-1 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  অগ্রিম পেমেন্ট
                </label>
                <input
                  {...register("advance")}
                  type="text"
                  placeholder="অন্যান্য খরচ..."
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-left">
            <BtnSubmit>সাবমিট করুন</BtnSubmit>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTripForm;
