import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { FiCalendar } from "react-icons/fi";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { useLoaderData } from "react-router-dom";
import Select from "react-select";
import BtnSubmit from "../../components/Button/BtnSubmit";

const UpdateFuelForm = () => {
  //   update loader data
  const updateFuelLoaderData = useLoaderData();
  const {
    id,
    date_time,
    driver_name,
    vehicle_number,
    trip_id_invoice_no,
    pump_name_address,
    capacity,
    type,
    quantity,
    price,
    total_price,
  } = updateFuelLoaderData.data;

  const fuelDateRef = useRef(null);
  const { register, handleSubmit, control, watch } = useForm({
    defaultValues: {
      driver_name: driver_name || "",
      vehicle_number: vehicle_number || "",
    },
  });
  // calsulate total fuel price
  const fuelQuantity = parseFloat(watch("quantity") || 0);
  const fuelPrice = parseFloat(watch("price") || 0);
  const total = fuelQuantity * fuelPrice;
  // driver name
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

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(
        `https://api.dropshep.com/api/fuel/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resData = response.data;

      if (resData.status === "success") {
        toast.success("ফুয়েল সফলভাবে আপডেট হয়েছে!", {
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
      <h3 className="px-6 py-2 bg-primary text-white font-semibold rounded-t-md">
        ফুয়েলের তথ্য আপডেট ফর্ম
      </h3>
      <div className="mx-auto p-6 bg-gray-100 rounded-md shadow">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Toaster position="top-center" reverseOrder={false} />
          {/*  */}
          <div className="md:flex justify-between gap-3">
            <div className="w-full">
              <label className="text-primary text-sm font-semibold">
                তারিখ
              </label>
              <div className="relative">
                <input
                  type="date"
                  defaultValue={date_time}
                  {...register("date_time")}
                  ref={(e) => {
                    register("date_time").ref(e);
                    fuelDateRef.current = e;
                  }}
                  className="remove-date-icon mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none pr-10"
                />
                <span className="py-[11px] absolute right-0 px-3 top-[22px] transform -translate-y-1/2 bg-primary rounded-r">
                  <FiCalendar
                    className="text-white cursor-pointer"
                    onClick={() => fuelDateRef.current?.showPicker?.()}
                  />
                </span>
              </div>
            </div>
            <div className="w-full relative">
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
                    defaultValue={vehicle_number}
                    className="mt-1 text-sm"
                    classNamePrefix="react-select"
                    isClearable
                  />
                )}
              />
            </div>
          </div>
          {/*  */}
          <div className="mt-1 md:flex justify-between gap-3">
            <div className="mt-3 md:mt-1 w-full relative">
              <label className="text-primary text-sm font-semibold">
                ড্রাইভারের নাম
              </label>
              <Controller
                name="driver_name"
                control={control}
                render={({ field: { onChange, value, ref } }) => (
                  <Select
                    inputRef={ref}
                    value={driverOptions.find((c) => c.value === value) || null}
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
            <div className="mt-3 md:mt-1 w-full relative">
              <label className="text-primary text-sm font-semibold">
                ট্রিপ আইডি / ইনভয়েস নাম্বার
              </label>
              <input
                {...register("trip_id_invoice_no")}
                defaultValue={trip_id_invoice_no}
                type="text"
                placeholder="ট্রিপ আইডি / ইনভয়েস নাম্বার..."
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
            </div>
          </div>
          {/*  */}
          <div className="md:flex justify-between gap-3">
            <div className="mt-3 md:mt-1 w-full relative">
              <label className="text-primary text-sm font-semibold">
                পাম্পের নাম ও ঠিকানা
              </label>
              <input
                {...register("pump_name_address")}
                defaultValue={pump_name_address}
                type="text"
                placeholder="পাম্পের নাম ও ঠিকানা..."
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
            </div>
            <div className="mt-1 w-full relative">
              <label className="text-primary text-sm font-semibold">
                ফুয়েল ক্যাপাসিটি
              </label>
              <input
                {...register("capacity")}
                defaultValue={capacity}
                type="number"
                placeholder="ফুয়েল ক্যাপাসিটি..."
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
            </div>
          </div>
          {/*  */}
          <div className="md:flex justify-between gap-3">
            <div className="mt-3 md:mt-1 w-full">
              <label className="text-primary text-sm font-semibold">
                তেলের ধরন
              </label>
              <select
                {...register("type")}
                className="mt-1 w-full text-gray-500 text-sm border border-gray-300 bg-white p-2 rounded appearance-none outline-none"
              >
                <option value={type}>{type}</option>
                <option value="Octen">Octen</option>
                <option value="Gas">Gas</option>
                <option value="Petroll">Petroll</option>
                <option value="Diesel">Diesel</option>
              </select>
              <MdOutlineArrowDropDown className="absolute top-[35px] right-2 pointer-events-none text-xl text-gray-500" />
            </div>
            <div className="mt-1 w-full">
              <label className="text-primary text-sm font-semibold">
                তেলের পরিমাণ
              </label>
              <div className="relative">
                <input
                  {...register("quantity")}
                  defaultValue={quantity}
                  type="number"
                  placeholder="তেলের পরিমাণ..."
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
              </div>
            </div>
          </div>
          {/*  */}
          <div className="md:flex justify-between gap-3">
            <div className="mt-3 md:mt-1 w-full relative">
              <label className="text-primary text-sm font-semibold">
                প্রতি লিটারের দাম
              </label>
              <input
                {...register("price")}
                defaultValue={price}
                type="number"
                placeholder="প্রতি লিটারের দাম..."
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
            </div>
            <div className="mt-1 w-full relative">
              <label className="text-primary text-sm font-semibold">
                মোট টাকা
              </label>
              <input
                readOnly
                {...register("total_price")}
                defaultValue={total_price}
                value={total}
                type="text"
                placeholder="মোট টাকা..."
                className="cursor-not-allowed mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-gray-200 outline-none"
              />
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

export default UpdateFuelForm;
