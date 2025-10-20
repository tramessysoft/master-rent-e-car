import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdOutlineArrowDropDown } from "react-icons/md";
import "react-datepicker/dist/react-datepicker.css";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FiCalendar } from "react-icons/fi";
import { useLoaderData } from "react-router-dom";
import Select from "react-select";
import BtnSubmit from "../../components/Button/BtnSubmit";

const UpdateMaintenanceForm = () => {
  // load data
  const updateMaintenanceLoaderData = useLoaderData();
  const {
    id,
    date,
    service_type,
    vehicle_no,
    parts_and_spairs,
    maintenance_type,
    cost,
    cost_by,
    total_cost,
    dignifies,
    service_for,
    receipt,
  } = updateMaintenanceLoaderData.data;
  const [previewImage, setPreviewImage] = useState(receipt);

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
  // select driver
  const [drivers, setDrivers] = useState([]);
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
  const { register, handleSubmit, setValue, control } = useForm({
    defaultValues: {
      service_for: service_for || "",
      vehicle_no: vehicle_no || "",
    },
  });

  const maintenanceDateRef = useRef(null);

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
        `https://api.dropshep.com/api/maintenance/${id}`,
        formData
      );

      const resData = response.data;
      if (resData.status === "success") {
        toast.success("তথ্য সফলভাবে সংরক্ষণ হয়েছে!", {
          position: "top-right",
        });
        setPreviewImage(null);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
      setValue("receipt", file);
    }
  };

  return (
    <div className="mt-10">
      <Toaster />
      <h3 className="px-6 py-2 bg-primary text-white font-semibold rounded-t-md">
        মেইনটেনেন্স ফর্ম
      </h3>
      <div className="mx-auto p-6 bg-gray-100 rounded-md shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="md:flex justify-between gap-3">
            <div className="w-full">
              <label className="text-primary text-sm font-semibold">
                মেইনটেনেন্স তারিখ
              </label>
              <div className="relative">
                <input
                  type="text"
                  defaultValue={date}
                  {...register("date")}
                  ref={(e) => {
                    register("date").ref(e);
                    maintenanceDateRef.current = e;
                  }}
                  className="remove-date-icon mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none pr-10"
                />
                <span className="py-[11px] absolute right-0 px-3 top-[22px] transform -translate-y-1/2 bg-primary rounded-r">
                  <FiCalendar
                    className="text-white cursor-pointer"
                    onClick={() => maintenanceDateRef.current?.showPicker?.()}
                  />
                </span>
              </div>
            </div>
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                সার্ভিসের ধরন
              </label>
              <select
                {...register("service_type")}
                defaultValue={service_type}
                className="mt-1 w-full text-gray-500 text-sm border border-gray-300 bg-white p-2 rounded appearance-none outline-none"
              >
                <option value="Maintenance">Maintenance</option>
                <option value="General">General</option>
              </select>
              <MdOutlineArrowDropDown className="absolute top-[35px] right-2 pointer-events-none text-xl text-gray-500" />
            </div>
          </div>

          <div className="md:flex justify-between gap-3">
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                পার্টস এন্ড স্পায়ারস
              </label>
              <select
                {...register("parts_and_spairs")}
                defaultValue={parts_and_spairs}
                className="mt-1 w-full text-gray-500 text-sm border border-gray-300 bg-white p-2 rounded appearance-none outline-none"
              >
                <option value="EngineOil">Engine Oil</option>
                <option value="Pistons">Pistons</option>
                <option value="ABS_Sensors">ABS Sensors</option>
                <option value="BrakeDrum">Brake Drum</option>
              </select>
              <MdOutlineArrowDropDown className="absolute top-[35px] right-2 pointer-events-none text-xl text-gray-500" />
            </div>
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                মেইনটেনেসের ধরন
              </label>
              <select
                {...register("maintenance_type")}
                defaultValue={maintenance_type}
                className="mt-1 w-full text-gray-500 text-sm border border-gray-300 bg-white p-2 rounded appearance-none outline-none"
              >
                <option value="EngineOil">Engine Oil</option>
                <option value="Pistons">Pistons</option>
                <option value="ABS_Sensors">ABS Sensors</option>
                <option value="BrakeDrum">Brake Drum</option>
              </select>
              <MdOutlineArrowDropDown className="absolute top-[35px] right-2 pointer-events-none text-xl text-gray-500" />
            </div>
          </div>

          <div className="md:flex justify-between gap-3">
            <div className="w-full">
              <label className="text-primary text-sm font-semibold">খরচ</label>
              <input
                {...register("cost")}
                type="number"
                defaultValue={cost}
                placeholder="খরচ ..."
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
            </div>
            <div className="w-full">
              <label className="text-primary text-sm font-semibold">
                গাড়ির নম্বর
              </label>
              <Controller
                name="vehicle_no"
                control={control}
                render={({ field: { onChange, value, ref } }) => (
                  <Select
                    inputRef={ref}
                    value={
                      vehicleOptions.find((c) => c.value === value) || null
                    }
                    onChange={(val) => onChange(val ? val.value : "")}
                    options={vehicleOptions}
                    placeholder={vehicle_no}
                    className="mt-1 text-sm"
                    classNamePrefix="react-select"
                    isClearable
                  />
                )}
              />
            </div>
          </div>

          <div className="md:flex justify-between gap-3">
            <div className="w-full">
              <label className="text-primary text-sm font-semibold">
                চার্জ বাই
              </label>
              <input
                {...register("cost_by")}
                defaultValue={cost_by}
                placeholder="চার্জ বাই..."
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
            </div>
            <div className="w-full">
              <label className="text-primary text-sm font-semibold">
                সর্বমোট খরচ
              </label>
              <input
                {...register("total_cost")}
                defaultValue={total_cost}
                placeholder="সর্বমোট খরচ..."
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
            </div>
          </div>

          <div className="md:flex justify-between gap-3">
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                প্রিয়োরিটি
              </label>
              <select
                {...register("dignifies")}
                defaultValue={dignifies}
                className="mt-1 w-full text-gray-500 text-sm border border-gray-300 bg-white p-2 rounded appearance-none outline-none"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <MdOutlineArrowDropDown className="absolute top-[35px] right-2 pointer-events-none text-xl text-gray-500" />
            </div>
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                সার্ভিস ফর
              </label>
              <Controller
                name="service_for"
                control={control}
                render={({ field: { onChange, value, ref } }) => (
                  <Select
                    inputRef={ref}
                    value={driverOptions.find((c) => c.value === value) || null}
                    onChange={(val) => onChange(val ? val.value : "")}
                    options={driverOptions}
                    placeholder="ড্রাইভারের নাম নির্বাচন করুন..."
                    className="mt-1 text-sm"
                    classNamePrefix="react-select"
                    isClearable
                  />
                )}
              />
            </div>
            <div className="w-full">
              <label className="text-primary text-sm font-semibold">
                ক্যাশ মেমো / কাগজের ছবি
              </label>
              <div className="relative mt-1">
                <label
                  htmlFor="receipt"
                  className="border p-2 rounded w-full block bg-white text-gray-500 text-sm cursor-pointer"
                >
                  {previewImage ? "ছবি নির্বাচিত হয়েছে" : "ছবি বাচাই করুন"}
                </label>
                <input
                  id="receipt"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e)}
                />
              </div>
              {previewImage && (
                <div className="mt-3 relative flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null);
                      document.querySelector('input[type="file"]').value = null;
                      setValue("receipt", null);
                    }}
                    className="absolute top-2 right-2 text-red-600 bg-white shadow rounded-sm hover:text-white hover:bg-secondary transition-all duration-300 cursor-pointer font-bold text-xl p-[2px]"
                    title="Remove image"
                  >
                    <IoMdClose />
                  </button>
                  <img
                    src={
                      previewImage?.startsWith("blob:")
                        ? previewImage
                        : `https://api.dropshep.com/public/uploads/maintenance/${previewImage}`
                    }
                    alt="Receipt Preview"
                    className="max-w-xs h-auto rounded border border-gray-300"
                  />
                </div>
              )}
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

export default UpdateMaintenanceForm;
