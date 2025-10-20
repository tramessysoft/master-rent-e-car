import React from "react";
import { useForm } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import { MdOutlineArrowDropDown } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import BtnSubmit from "../components/Button/BtnSubmit";

const AddUserForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const password = watch("password");
  //
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }
      const response = await axios.post(
        "https://api.dropshep.com/api/users",
        formData
      );
      const resData = response.data;
      if (resData.status === "success") {
        toast.success("ইউজার সফলভাবে যোগ হয়েছে!", { position: "top-right" });
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
        ইউজার যোগ করুন
      </h3>
      <div className="mx-auto p-6 bg-gray-100 rounded-md shadow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Row 1 */}
          <div className="md:flex justify-between gap-3">
            <div className="w-full">
              <label className="text-primary text-sm font-semibold">
                নাম *
              </label>
              <input
                {...register("name", { required: true })}
                type="text"
                placeholder="নাম..."
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
              {errors.name && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
            </div>
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                মোবাইল *
              </label>
              <input
                {...register("phone", { required: true })}
                type="number"
                placeholder="মোবাইল..."
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
              {errors.phone && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
            </div>
          </div>

          {/* Row 2 */}
          <div className="md:flex justify-between gap-3">
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                ইমেইল *
              </label>
              <input
                {...register("email", { required: true })}
                type="email"
                placeholder="ইমেইল..."
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
              {errors.email && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
            </div>
            <div className="mt-3 md:mt-0 w-full relative">
              <label className="text-primary text-sm font-semibold">
                পাসওয়ার্ড
              </label>
              <input
                {...register("password", { required: "পাসওয়ার্ড আবশ্যক" })}
                type="password"
                placeholder="পাসওয়ার্ড..."
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
              {errors.password && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
            </div>
            <div className="mt-3 md:mt-0 w-full relative">
              <label className="text-primary text-sm font-semibold">
                কনফার্ম পাসওয়ার্ড
              </label>
              <input
                type="password"
                placeholder="কনফার্ম পাসওয়ার্ড..."
                {...register("confirmPassword", {
                  required: "কনফার্ম পাসওয়ার্ড আবশ্যক",
                  validate: (value) =>
                    value === password || "পাসওয়ার্ড মেলেনি",
                })}
                className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
              />
              {errors.password && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
            </div>
          </div>

          {/* Row 3 */}
          <div className="md:flex justify-between gap-3">
            <div className="w-full relative">
              <label className="text-primary text-sm font-semibold">
                ইউজারের ধরন
              </label>
              <select
                {...register("role", { required: true })}
                className="mt-1 w-full text-gray-500 text-sm border border-gray-300 bg-white p-2 rounded appearance-none outline-none"
              >
                <option value="">ইউজারের ধরন...</option>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
              {errors.role && (
                <span className="text-red-600 text-sm">পূরণ করতে হবে</span>
              )}
              <MdOutlineArrowDropDown className="absolute top-[35px] right-2 pointer-events-none text-xl text-gray-500" />
            </div>
            <div className="mt-3 md:mt-0 relative w-full">
              <label className="text-primary text-sm font-semibold">
                স্ট্যাটাস
              </label>
              <select
                {...register("status", { required: true })}
                className="mt-1 w-full text-gray-500 text-sm border border-gray-300 bg-white p-2 rounded appearance-none outline-none"
              >
                <option value="">স্ট্যাটাস...</option>
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
          <div className="mt-6">
            <BtnSubmit>সাবমিট করুন</BtnSubmit>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;
