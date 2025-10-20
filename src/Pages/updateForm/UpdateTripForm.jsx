import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { FiCalendar } from "react-icons/fi";
import { useLoaderData } from "react-router-dom";
import Select from "react-select";
import BtnSubmit from "../../components/Button/BtnSubmit";

const UpdateTripForm = () => {
  //   update loader data
  const updateTripLoaderData = useLoaderData();
  const {
    id,
    trip_date,
    trip_time,
    driver_name,
    vehicle_number,
    load_point,
    unload_point,
    driver_contact,
    driver_percentage,
    fuel_price,
    gas_price,
    other_expenses,
    trip_price,
    demarage,
    customer,
    advance,
  } = updateTripLoaderData.data;
  const { register, handleSubmit, control, watch } = useForm({
    defaultValues: {
      driver_name: driver_name || "",
      vehicle_number: vehicle_number || "",
    },
  });
  const tripDateRef = useRef(null);
  // select driver
  const [drivers, setDrivers] = useState([]);
  // car name / registration number
  const [vehicles, setVehicles] = useState([]);
  useEffect(() => {
    fetch("https://api.dropshep.com/api/vehicle")
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
    fetch("https://api.dropshep.com/api/driver")
      .then((response) => response.json())
      .then((data) => setDrivers(data.data))
      .catch((error) => console.error("Error fetching driver data:", error));
  }, []);

  const driverOptions = drivers.map((driver) => ({
    value: driver.name,
    label: driver.name,
  }));

  const commision = parseFloat(watch("driver_percentage") || 0);
  const fuel = parseFloat(watch("fuel_price") || 0);
  const gas = parseFloat(watch("gas_price") || 0);
  const totalDamarage = parseFloat(watch("demarage") || 0);
  const other = parseFloat(watch("other_expenses") || 0);
  const total = commision + fuel + gas + totalDamarage + other;

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `https://api.dropshep.com/api/trip/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resData = response.data;

      if (resData.status === "success") {
        toast.success("ট্রিপ সফলভাবে আপডেট হয়েছে!", { position: "top-right" });
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
        ট্রিপ আপডেট করুন
      </h3>
      <div className="mx-auto p-6 bg-gray-100 rounded-md shadow">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Toaster position="top-center" reverseOrder={false} />
          {/*  */}
          <div className="border border-gray-300 p-3 md:p-5 rounded-md">
            <h5 className="text-primary font-semibold text-center md:pb-5">
              <span className="py-2 border-b-2 border-primary">
                ট্রিপ এবং গন্তব্য সেকশন
              </span>
            </h5>
            <div className="mt-5 md:mt-0 md:flex justify-between gap-3">
              <div className="w-full">
                <label className="text-primary text-sm font-semibold">
                  তারিখ
                </label>
                <div className="relative">
                  <input
                    type="date"
                    {...register("trip_date")}
                    defaultValue={trip_date}
                    ref={(e) => {
                      register("trip_date").ref(e);
                      tripDateRef.current = e;
                    }}
                    className="remove-date-icon mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none pr-10"
                  />
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
                  ট্রিপের সময়
                </label>
                <input
                  {...register("trip_time")}
                  defaultValue={trip_time}
                  type="text"
                  placeholder="ট্রিপের সময়..."
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
              </div>
            </div>
            {/*  */}
            <div className="mt-1 md:flex justify-between gap-3">
              <div className="mt-2 md:mt-0 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  লোড পয়েন্ট
                </label>
                <input
                  {...register("load_point")}
                  defaultValue={load_point}
                  type="text"
                  placeholder="লোড পয়েন্ট..."
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
              </div>
              <div className="mt-2 md:mt-0 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  আনলোড পয়েন্ট
                </label>
                <input
                  {...register("unload_point")}
                  defaultValue={unload_point}
                  type="text"
                  placeholder="আনলোড পয়েন্ট..."
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
              </div>
            </div>
          </div>
          {/*  */}
          <div className="mt-3 border border-gray-300 p-5 rounded-md">
            <h5 className="text-primary font-semibold text-center pb-5">
              <span className="py-2 border-b-2 border-primary">
                গাড়ি এবং ড্রাইভারের তথ্য
              </span>
            </h5>
            <div className="md:flex justify-between gap-3">
              <div className="mt-2 md:mt-0 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  গাড়ির নম্বর
                </label>
                <Controller
                  name="vehicle_number"
                  control={control}
                  render={({ field: { onChange, value, ref } }) => (
                    <Select
                      inputRef={ref}
                      value={
                        vehicleOptions.find((c) => c.value === value) || null
                      }
                      onChange={(val) => onChange(val ? val.value : "")}
                      options={vehicleOptions}
                      placeholder={vehicle_number}
                      className="mt-1 text-sm"
                      classNamePrefix="react-select"
                      isClearable
                    />
                  )}
                />
              </div>
              <div className="w-full relative">
                <label className="text-primary text-sm font-semibold">
                  ড্রাইভারের নাম
                </label>
                <Controller
                  name="driver_name"
                  control={control}
                  render={({ field: { onChange, value, ref } }) => (
                    <Select
                      inputRef={ref}
                      value={
                        driverOptions.find((c) => c.value === value) || null
                      }
                      onChange={(val) => onChange(val ? val.value : "")}
                      options={driverOptions}
                      placeholder={driver_name}
                      className="mt-1 text-sm"
                      classNamePrefix="react-select"
                      isClearable
                    />
                  )}
                />
              </div>
            </div>
            <div className="mt-1 md:flex justify-between gap-3">
              <div className="mt-2 md:mt-0 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  ড্রাইভারের মোবাইল
                </label>
                <input
                  {...register("driver_contact")}
                  defaultValue={driver_contact}
                  type="number"
                  placeholder="ড্রাইভারের মোবাইল..."
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
              </div>
              <div className="mt-2 md:mt-0 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  ড্রাইভারের কমিশন
                </label>
                <input
                  {...register("driver_percentage")}
                  defaultValue={driver_percentage}
                  type="number"
                  placeholder="ড্রাইভারের কমিশন..."
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
              </div>
            </div>
          </div>
          {/*  */}
          <div className="mt-3 border border-gray-300 p-5 rounded-md">
            <h5 className="text-primary font-semibold text-center pb-5">
              <span className="py-2 border-b-2 border-primary">চলমান খরচ</span>
            </h5>
            <div className="md:flex justify-between gap-3">
              <div className="w-full relative">
                <label className="text-primary text-sm font-semibold">
                  তেলের মূল্য
                </label>
                <input
                  {...register("fuel_price")}
                  defaultValue={fuel_price}
                  type="number"
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
                  defaultValue={gas_price}
                  type="number"
                  placeholder="গ্যাসের মূল্য..."
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
              </div>
            </div>
            <div className="mt-1 md:flex justify-between gap-3">
              <div className="mt-2 md:mt-0 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  অন্যান্য খরচ
                </label>
                <input
                  {...register("other_expenses")}
                  defaultValue={other_expenses}
                  type="number"
                  placeholder="অন্যান্য খরচ..."
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
              </div>
              <div className="mt-2 md:mt-1 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  জরিমানা
                </label>
                <input
                  {...register("demarage")}
                  defaultValue={demarage}
                  type="number"
                  placeholder="জরিমানা..."
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
              </div>

              <div className="w-full">
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
          <div className="mt-3 border border-gray-300 p-5 rounded-md">
            <h5 className="text-primary font-semibold text-center pb-5">
              <span className="py-2 border-b-2 border-primary">
                কাস্টমার এবং পেমেন্ট তথ্য
              </span>
            </h5>
            <div className="md:flex justify-between gap-3">
              <div className="mt-2 md:mt-1 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  কাস্টমারের নাম
                </label>
                <input
                  {...register("customer")}
                  defaultValue={customer}
                  type="text"
                  placeholder="কাস্টমারের নাম..."
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
              </div>
              <div className="mt-2 md:mt-1 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  ট্রিপের ভাড়া
                </label>
                <input
                  {...register("trip_price")}
                  defaultValue={trip_price}
                  type="text"
                  placeholder={trip_price}
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
              </div>
              <div className="mt-2 md:mt-1 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  অগ্রিম পেমেন্ট
                </label>
                <input
                  {...register("advance")}
                  defaultValue={advance}
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

export default UpdateTripForm;
