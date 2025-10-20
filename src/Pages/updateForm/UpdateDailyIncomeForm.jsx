import axios from "axios";
import React, { useRef } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { FiCalendar } from "react-icons/fi";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { useLoaderData } from "react-router-dom";
import BtnSubmit from "../../components/Button/BtnSubmit";

const UpdateDailyIncomeForm = () => {
  const { register, handleSubmit } = useForm();
  const tripDateRef = useRef(null);
  //   update loader data
  const updateTripLoaderData = useLoaderData();
  const {
    id,
    trip_date,
    trip_time,
    load_point,
    unload_point,
    driver_name,
    driver_contact,
    driver_percentage,
    fuel_price,
    gas_price,
    vehicle_number,
    other_expenses,
    trip_price,
    customer: customer,
    advance: advance,
  } = updateTripLoaderData.data;
  const fuel = parseFloat(fuel_price) || 0;
  const gas = parseFloat(gas_price) || 0;
  const other = parseFloat(other_expenses) || 0;
  const total = fuel + gas + other;
  const onSubmit = async (data) => {
    try {
      const updatedData = {
        trip_date: data.trip_date,
        trip_time: trip_time,
        load_point: data.load_point,
        unload_point: data.unload_point,
        driver_name: driver_name,
        driver_contact: driver_contact,
        driver_percentage: driver_percentage,
        fuel_price: data.fuel_price,
        gas_price: data.gas_price,
        vehicle_number: data.vehicle_number,
        other_expenses: data.other_expenses,
        trip_price: data.trip_price,
        customer: customer,
        advance: advance,
      };

      const response = await axios.post(
        `https://api.dropshep.com/api/trip/${id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resData = response.data;
      if (resData.status === "success") {
        toast.success("দৈনিক আয় সফলভাবে আপডেট হয়েছে!", {
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
        দৈনিক আয় আপডেট করুন
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
                  তারিখ *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    defaultValue={trip_date}
                    {...register("trip_date")}
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
                  গাড়ির নম্বর
                </label>
                <select
                  {...register("vehicle_number")}
                  className="mt-1 w-full text-gray-500 text-sm border border-gray-300 bg-white p-2 rounded appearance-none outline-none"
                >
                  <option value={vehicle_number}>{vehicle_number}</option>
                  <option value="Dhama metro-1">Dhama metro-1</option>
                  <option value="Dhama metro-2">Dhama metro-2</option>
                </select>
                <MdOutlineArrowDropDown className="absolute top-[35px] right-2 pointer-events-none text-xl text-gray-500" />
              </div>
            </div>
            {/*  */}
            <div className="md:flex justify-between gap-3">
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
                  defaultValue={gas_price}
                  type="text"
                  placeholder="গ্যাসের মূল্য..."
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
              </div>
            </div>
            <div className="md:flex justify-between gap-3">
              <div className="mt-2 md:mt-0 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  অন্যান্য খরচ
                </label>
                <input
                  {...register("other_expenses")}
                  defaultValue={other_expenses}
                  type="text"
                  placeholder="অন্যান্য খরচ..."
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
                  className="cursor-not-allowed mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
              </div>
              <div className="mt-2 md:mt-0 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  ট্রিপের ভাড়া
                </label>
                <input
                  {...register("trip_price")}
                  defaultValue={trip_price}
                  type="text"
                  placeholder="ট্রিপের ভাড়া..."
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

export default UpdateDailyIncomeForm;
