import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiCalendar } from "react-icons/fi";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { MdOutlineArrowDropDown } from "react-icons/md";
import Select from "react-select";
import BtnSubmit from "../components/Button/BtnSubmit";
const AddCarForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();
  const registrationDateRef = useRef(null);
  const taxDateRef = useRef(null);
  const roadPermitRef = useRef(null);
  const fitnessDateRef = useRef(null);
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

  // post vehicle
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }
      const response = await axios.post(
        "https://api.dropshep.com/api/vehicle",
        formData
      );
      const resData = response.data;
      if (resData.status === "Vehicle saved successfully") {
        toast.success("গাড়ি সফলভাবে সংরক্ষণ হয়েছে!", { position: "top-right" });
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
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
      <Toaster position="top-center" reverseOrder={false} />
      <h3 className="px-6 py-2 bg-primary text-white font-semibold rounded-t-md">
        গাড়ির তথ্য যোগ করুন
      </h3>
      <div className="mx-auto p-6 bg-gray-100 rounded-md shadow space-y-4">
        {/* Vehicle & Driver Name */}
        <div className="md:flex justify-between gap-3">
          <div className="w-full">
            <label className="text-primary text-sm font-semibold">
              গাড়ির নাম
            </label>
            <input
              {...register("vehicle_name", { required: true })}
              type="text"
              placeholder="গাড়ির নাম..."
              className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
            />
            {errors.vehicle_name && (
              <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
            )}
          </div>
          <div className="relative mt-2 md:mt-0 w-full">
            <label className="text-primary text-sm font-semibold">
              ড্রাইভারের নাম
            </label>
            <Controller
              name="driver_name"
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

            {errors.driver_name && (
              <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
            )}
          </div>
        </div>
        {/* Category & Size */}
        <div className="md:flex justify-between gap-3">
          <div className="relative w-full">
            <label className="text-primary text-sm font-semibold">
              গাড়ির ধরন
            </label>
            <select
              {...register("category", { required: true })}
              className="mt-1 w-full text-gray-500 text-sm border border-gray-300 bg-white p-2 rounded appearance-none outline-none"
            >
              <option value="">গাড়ির ধরন...</option>
              <option value="X Corolla">X Corolla</option>
              <option value="Axio">Axio</option>
              <option value="Allion">Allion</option>
              <option value="Premio">Premio</option>
              <option value="X Noha">X Noha</option>
              <option value="Hiace">Hiace</option>
            </select>
            <MdOutlineArrowDropDown className="absolute top-[35px] right-2 pointer-events-none text-xl text-gray-500" />
            {errors.category && (
              <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
            )}
          </div>
          <div className="relative mt-2 md:mt-0 w-full">
            {/* todo garir size bad dite hobe */}
            <label className="text-primary text-sm font-semibold">
              গাড়ির আসন সংখ্যা
            </label>
            <select
              {...register("size", { required: true })}
              className="mt-1 w-full text-gray-500 text-sm border border-gray-300 bg-white p-2 rounded appearance-none outline-none"
            >
              <option value="">গাড়ির আসন সংখ্যা...</option>
              <option value="4">৪</option>
              <option value="7">৭</option>
              <option value="11">১১</option>
            </select>
            {errors.size && (
              <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
            )}
            <MdOutlineArrowDropDown className="absolute top-[35px] right-2 pointer-events-none text-xl text-gray-500" />
          </div>
        </div>

        {/* Registration Number & Serial */}
        <div className="md:flex justify-between gap-3">
          <div className="w-full">
            <label className="text-primary text-sm font-semibold">
              রেজিস্ট্রেশন নাম্বার
            </label>
            <input
              {...register("registration_number", { required: true })}
              type="text"
              placeholder=" রেজিস্ট্রেশন নাম্বার..."
              className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
            />
            {errors.registration_number && (
              <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
            )}
          </div>
          <div className="relative mt-2 md:mt-0 w-full">
            <label className="text-primary text-sm font-semibold">
              রেজিস্ট্রেশন সিরিয়াল
            </label>
            <select
              {...register("registration_serial", { required: true })}
              className="mt-1 w-full text-gray-500 text-sm border border-gray-300 bg-white p-2 rounded appearance-none outline-none"
            >
              <option value="">রেজিস্ট্রেশন সিরিয়াল...</option>
              <option value="Ga">গ</option>
              <option value="GH">ঘ</option>
              <option value="Ca">চ</option>
            </select>
            <MdOutlineArrowDropDown className="absolute top-[35px] right-2 pointer-events-none text-xl text-gray-500" />
            {errors.registration_serial && (
              <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
            )}
          </div>
        </div>

        {/* Registration Zone */}
        <div className="md:flex justify-between gap-3">
          <div className="relative w-full">
            <label className="text-primary text-sm font-semibold">
              রেজিস্ট্রেশন এলাকা
            </label>
            <select
              {...register("registration_zone", { required: true })}
              className="mt-1 w-full text-gray-500 text-sm border border-gray-300 bg-white p-2 rounded appearance-none outline-none"
            >
              <option value="">রেজিস্ট্রেশন এলাকা...</option>
              <option value="Dhaka Metro">ঢাকা মেট্রো</option>
              <option value="Chatto Metro">চট্ট মেট্রো</option>
              <option value="Sylhet Metro">সিলেট মেট্রো</option>
              <option value="Rajshahi Metro">রাজশাহী মেট্রো</option>
              <option value="Khulna Metro">খুলনা মেট্রো</option>
              <option value="Rangpur Metro">রংপুর মেট্রো</option>
              <option value="Barisal Metro">বরিশাল মেট্রো</option>

              <option value="Dhaka">ঢাকা</option>
              <option value="Narayanganj">নারায়ণগঞ্জ</option>
              <option value="Gazipur">গাজীপুর</option>
              <option value="Tangail">টাঙ্গাইল</option>
              <option value="Manikgonj">মানিকগঞ্জ</option>
              <option value="Munshigonj">মুন্সিগঞ্জ</option>
              <option value="Faridpur">ফরিদপুর</option>
              <option value="Rajbari">রাজবাড়ী</option>
              <option value="Narsingdi">নরসিংদী</option>
              <option value="Kishorgonj">কিশোরগঞ্জ</option>
              <option value="Shariatpur">শরীয়তপুর</option>
              <option value="Gopalgonj">গোপালগঞ্জ</option>
              <option value="Madaripur">মাদারীপুর</option>

              <option value="Chattogram">চট্টগ্রাম</option>
              <option value="Cumilla">কুমিল্লা</option>
              <option value="Feni">ফেনী</option>
              <option value="Brahmanbaria">ব্রাহ্মণবাড়িয়া</option>
              <option value="Noakhali">নোয়াখালী</option>
              <option value="Chandpur">চাঁদপুর</option>
              <option value="Lokkhipur">লক্ষ্মীপুর</option>
              <option value="Bandarban">বান্দরবন</option>
              <option value="Rangamati">রাঙ্গামাটি</option>
              <option value="CoxsBazar">কক্সবাজার</option>
              <option value="Khagrasori">খাগড়াছড়ি</option>

              <option value="Barisal">বরিশাল</option>
              <option value="Barguna">বরগুনা</option>
              <option value="Bhola">ভোলা</option>
              <option value="Patuakhali">পটুয়াখালী</option>
              <option value="Pirojpur">পিরোজপুর</option>
              <option value="Jhalokati">ঝালোকাঠি</option>

              <option value="Khulna">খুলনা</option>
              <option value="Kustia">কুষ্টিয়া</option>
              <option value="Jashore">যশোর</option>
              <option value="Chuadanga">চুয়াডাঙ্গা</option>
              <option value="Satkhira">সাতক্ষীরা</option>
              <option value="Bagerhat">বাগেরহ্যাঁট</option>
              <option value="Meherpur">মেহেরপুর</option>
              <option value="Jhenaidah">ঝিনাইদাহ</option>
              <option value="Norail">নড়াইল</option>
              <option value="Magura">মাগুরা</option>

              <option value="Rangpur">রংপুর</option>
              <option value="Ponchogor">পঞ্চগড়</option>
              <option value="Thakurgaon">ঠাকুরগাও</option>
              <option value="Kurigram">কুড়িগ্রাম</option>
              <option value="Dinajpur">দিনাজপুর</option>
              <option value="Nilfamari">নীলফামারী</option>
              <option value="Lalmonirhat">লালমনিরহ্যাঁট</option>
              <option value="Gaibandha">গাইবান্দা</option>

              <option value="Rajshahi">রাজশাহী</option>
              <option value="Pabna">পাবনা</option>
              <option value="Bagura">বগুড়া</option>
              <option value="Joypurhat">জয়পুরহ্যাঁট</option>
              <option value="Nouga">নওগাঁ</option>
              <option value="Natore">নাটোর</option>
              <option value="Sirajgonj">সিরাজগঞ্জ</option>
              <option value="Chapainawabganj">চাপাইনবাবগঞ্জ</option>

              <option value="Sylhet">সিলেট</option>
              <option value="Habiganj">হবিগঞ্জ</option>
              <option value="Moulvibazar">মৌলভীবাজার</option>
              <option value="Sunamgonj">সুনামগঞ্জ</option>

              <option value="Mymensingh">ময়মনসিংহ</option>
              <option value="Netrokona">নেত্রকোনা</option>
              <option value="Jamalpur">জামালপুর</option>
              <option value="Sherpur">শেরপুর</option>
            </select>
            <MdOutlineArrowDropDown className="absolute top-[35px] right-2 pointer-events-none text-xl text-gray-500" />
            {errors.registration_zone && (
              <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
            )}
          </div>

          <div className="relative w-full">
            <label className="text-primary text-sm font-semibold">
              রেজিস্ট্রেশন তারিখ
            </label>
            <div className="relative">
              <input
                type="date"
                {...register("registration_date", { required: true })}
                ref={(e) => {
                  register("registration_date").ref(e);
                  registrationDateRef.current = e;
                }}
                className="remove-date-icon mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none pr-10"
              />
              {errors.registration_date && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
              <span className="py-[11px] absolute right-0 px-3 top-[22px] transform -translate-y-1/2 bg-primary rounded-r">
                <FiCalendar
                  className="text-white cursor-pointer"
                  onClick={() => registrationDateRef.current?.showPicker?.()}
                />
              </span>
            </div>
          </div>
          <div className="mt-2 md:mt-0 w-full">
            <label className="text-primary text-sm font-semibold">
              ট্যাক্স মেয়াদোত্তীর্ণ তারিখ
            </label>
            <div className="relative">
              <input
                type="date"
                {...register("text_date", { required: true })}
                ref={(e) => {
                  register("text_date").ref(e);
                  taxDateRef.current = e;
                }}
                className="remove-date-icon mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none pr-10"
              />
              {errors.text_date && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
              <span className="py-[11px] absolute right-0 px-3 top-[22px] transform -translate-y-1/2 bg-primary rounded-r">
                <FiCalendar
                  className="text-white cursor-pointer"
                  onClick={() => taxDateRef.current?.showPicker?.()}
                />
              </span>
            </div>
          </div>
        </div>

        {/* Date Fields */}
        <div className="md:flex justify-between gap-3">
          <div className="w-full">
            <label className="text-primary text-sm font-semibold">
              রোড পারমিট তারিখ
            </label>
            <div className="relative">
              <input
                type="date"
                {...register("road_permit_date", { required: true })}
                ref={(e) => {
                  register("road_permit_date").ref(e);
                  roadPermitRef.current = e;
                }}
                className="remove-date-icon mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none pr-10"
              />
              {errors.road_permit_date && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
              <span className="py-[11px] absolute right-0 px-3 top-[22px] transform -translate-y-1/2 bg-primary rounded-r">
                <FiCalendar
                  className="text-white cursor-pointer"
                  onClick={() => roadPermitRef.current?.showPicker?.()}
                />
              </span>
            </div>
          </div>
          <div className="mt-2 md:mt-0 w-full">
            <label className="text-primary text-sm font-semibold">
              ফিটনেস মেয়াদোত্তীর্ণ তারিখ
            </label>
            <div className="relative">
              <input
                type="date"
                {...register("fitness_date", { required: true })}
                ref={(e) => {
                  register("fitness_date").ref(e);
                  fitnessDateRef.current = e;
                }}
                className="remove-date-icon mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none pr-10"
              />
              {errors.fitness_date && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
              <span className="py-[11px] absolute right-0 px-3 top-[22px] transform -translate-y-1/2 bg-primary rounded-r">
                <FiCalendar
                  className="text-white cursor-pointer"
                  onClick={() => fitnessDateRef.current?.showPicker?.()}
                />
              </span>
            </div>
          </div>
          <div className="w-full relative">
            <label className="text-primary text-sm font-semibold">
              স্ট্যাটাস
            </label>
            <select
              {...register("status", { required: true })}
              className="mt-1 w-full text-gray-500 text-sm border border-gray-300 bg-white p-2 rounded appearance-none outline-none"
            >
              <option value="">স্ট্যাটাস নির্বাচন করুন</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {errors.status && (
              <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
            )}
            <MdOutlineArrowDropDown className="absolute top-[35px] right-2 pointer-events-none text-xl text-gray-500" />
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-left">
          <BtnSubmit>সাবমিট করুন</BtnSubmit>
        </div>
      </div>
    </form>
  );
};

export default AddCarForm;
