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
import CreatableSelect from "react-select/creatable";
const MaintenanceForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const maintenanceDateRef = useRef(null);
  // car name / registration number
  const [parts, setParts] = useState([]);
  useEffect(() => {
    fetch("https://api.dropshep.com/api/parts")
      .then((response) => response.json())
      .then((data) => setParts(data.data))
      .catch((error) => console.error("Error fetching driver data:", error));
  }, []);

  const partsOptions = parts.map((part) => ({
    value: part.name,
    label: part.name,
  }));
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
        "https://api.dropshep.com/api/maintenance",
        formData
      );
      const resData = response.data;

      if (resData.status === "success") {
        toast.success("তথ্য সফলভাবে সংরক্ষণ হয়েছে!", {
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
                  type="date"
                  {...register("date", { required: true })}
                  ref={(e) => {
                    register("date").ref(e);
                    maintenanceDateRef.current = e;
                  }}
                  className="remove-date-icon mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none pr-10"
                />
                {errors.date && (
                  <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
                )}
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
                {...register("service_type", { required: true })}
                className="mt-1 w-full text-gray-500 text-sm border border-gray-300 bg-white p-2 rounded appearance-none outline-none"
              >
                <option value="">সার্ভিসের ধরন</option>
                <option value="Maintenance">Maintenance</option>
                <option value="General">General</option>
              </select>
              {errors.service_type && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
              <MdOutlineArrowDropDown className="absolute top-[35px] right-2 pointer-events-none text-xl text-gray-500" />
            </div>
          </div>
          <div className="md:flex justify-between gap-3">
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                পার্টস এন্ড স্পায়ারস
              </label>
              <Controller
                name="parts_and_spairs"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value, ref } }) => (
                  <Select
                    inputRef={ref}
                    value={partsOptions.find((c) => c.value === value) || null}
                    onChange={(val) => onChange(val ? val.value : "")}
                    options={partsOptions}
                    placeholder="পার্টস এন্ড স্পায়ারস..."
                    className="mt-1 text-sm"
                    classNamePrefix="react-select"
                    isClearable
                  />
                )}
              />

              {errors.parts_and_spairs && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
            </div>
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                মেইনটেনেসের ধরন
              </label>
              <Controller
                name="maintenance_type"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, value, ref } }) => (
                  <CreatableSelect
                    inputRef={ref}
                    value={value ? { value: value, label: value } : null}
                    onChange={(val) => onChange(val ? val.value : "")}
                    options={[
                      { value: "EngineOil", label: "Engine Oil" },
                      { value: "Pistons", label: "Pistons" },
                      { value: "ABS_Sensors", label: "ABS Sensors" },
                      { value: "BrakeDrum", label: "Brake Drum" },
                    ]}
                    placeholder="মেইনটেনেসের ধরন লিখুন বা নির্বাচন করুন..."
                    className="mt-1 text-sm"
                    classNamePrefix="react-select"
                    isClearable
                    formatCreateLabel={(inputValue) =>
                      `"${inputValue}" যোগ করুন`
                    }
                  />
                )}
              />
              {errors.maintenance_type && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
            </div>
          </div>

          <div className="md:flex justify-between gap-3">
            <div className="w-full">
              <label className="text-primary text-sm font-semibold">খরচ</label>
              <input
                {...register("cost", { required: true })}
                type="number"
                placeholder="খরচ ..."
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
              {errors.cost && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
            </div>
            <div className="w-full">
              <label className="text-primary text-sm font-semibold">
                গাড়ির নম্বার
              </label>
              <Controller
                name="vehicle_no"
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

              {errors.vehicle_no && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
            </div>
          </div>

          <div className="md:flex justify-between gap-3">
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                চার্জ বাই
              </label>
              <input
                {...register("cost_by", { required: true })}
                type="text"
                placeholder="চার্জ বাই..."
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
              {errors.cost_by && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
            </div>
            <div className="w-full">
              <label className="text-primary text-sm font-semibold">
                সর্বমোট খরচ
              </label>
              <input
                {...register("total_cost", { required: true })}
                type="number"
                placeholder="সর্বমোট খরচ..."
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
              {errors.total_cost && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
            </div>
          </div>

          <div className="md:flex justify-between gap-3">
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                প্রিয়োরিটি
              </label>
              <select
                {...register("dignifies", { required: true })}
                className="mt-1 w-full text-gray-500 text-sm border border-gray-300 bg-white p-2 rounded appearance-none outline-none"
              >
                <option value="">মর্যাদা...</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              {errors.dignifies && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
              <MdOutlineArrowDropDown className="absolute top-[35px] right-2 pointer-events-none text-xl text-gray-500" />
            </div>
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                সার্ভিস ফর
              </label>
              <Controller
                name="service_for"
                control={control}
                rules={{ required: true }}
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
              {errors.service_for && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
            </div>
            <div className="w-full">
              <label className="text-primary text-sm font-semibold">
                ক্যাশ মেমো / কাগজের ছবি
              </label>
              <div className="relative mt-1">
                <Controller
                  name="receipt"
                  control={control}
                  rules={{ required: "পূরণ করতে হবে" }}
                  render={({
                    field: { onChange, ref },
                    fieldState: { error },
                  }) => (
                    <div className="relative mt-1">
                      <label
                        htmlFor="receipt"
                        className="border p-2 rounded w-full block bg-white text-gray-500 text-sm cursor-pointer"
                      >
                        {previewImage
                          ? "ছবি নির্বাচিত হয়েছে"
                          : "ছবি বাছাই করুন"}
                      </label>
                      <input
                        id="receipt"
                        type="file"
                        accept="image/*"
                        ref={ref}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            setPreviewImage(url);
                            onChange(file); // ✅ Very important: update form field
                          } else {
                            setPreviewImage(null);
                            onChange(null);
                          }
                        }}
                      />
                      {error && (
                        <span className="text-red-600 text-sm">
                          {error.message}
                        </span>
                      )}
                    </div>
                  )}
                />
              </div>
              {/* 🖼️ Image preview below file input */}
              {previewImage && (
                <div className="mt-3 relative flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage(null);
                      setValue("receipt", null, { shouldValidate: true });
                    }}
                    className="absolute top-2 right-2 text-red-600 bg-white shadow rounded-sm hover:text-white hover:bg-secondary transition-all duration-300 cursor-pointer font-bold text-xl p-[2px]"
                    title="Remove image"
                  >
                    <IoMdClose />
                  </button>
                  <img
                    src={previewImage}
                    alt="License Preview"
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

export default MaintenanceForm;
