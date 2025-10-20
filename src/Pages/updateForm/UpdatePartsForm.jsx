import axios from "axios";
import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { FiCalendar } from "react-icons/fi";
import { useLoaderData } from "react-router-dom";
import BtnSubmit from "../../components/Button/BtnSubmit";

const UpdatePartsForm = () => {
  const { register, handleSubmit } = useForm();
  const partsDateRef = useRef(null);
  const updatePartsLoaderData = useLoaderData();
  const { id, name, date } = updatePartsLoaderData.data;

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(
        `https://api.dropshep.com/api/parts/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resData = response.data;

      if (resData.status === "success") {
        toast.success("পার্টস সফলভাবে আপডেট হয়েছে!", { position: "top-right" });
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
    <div className="bg-gray-100 py-20">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
          <h2 className="text-xl font-semibold text-[#11375B] mb-4">
            পার্টস আপডেট করুন
          </h2>
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <div className="w-full relative">
                <label className="text-primary text-sm font-semibold">
                  পার্টসের নাম
                </label>
                <input
                  {...register("name")}
                  defaultValue={name}
                  type="text"
                  placeholder="পার্টসের নাম..."
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="w-full">
                <label className="text-primary text-sm font-semibold">
                  পার্টসের ভ্যালিডিটি
                </label>
                <div className="relative">
                  <input
                    type="date"
                    {...register("date")}
                    defaultValue={date}
                    ref={(e) => {
                      register("date").ref(e);
                      partsDateRef.current = e;
                    }}
                    className="remove-date-icon mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none pr-10"
                  />
                  <span className="py-[11px] absolute right-0 px-3 top-[22px] transform -translate-y-1/2 bg-primary rounded-r">
                    <FiCalendar
                      className="text-white cursor-pointer"
                      onClick={() => partsDateRef.current?.showPicker?.()}
                    />
                  </span>
                </div>
              </div>
            </div>
            {/* Submit Button */}
            <div className="text-right">
              <BtnSubmit>সাবমিট করুন</BtnSubmit>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePartsForm;
