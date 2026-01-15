import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { FiCalendar } from "react-icons/fi";
import { useNavigate, useLoaderData } from "react-router-dom";
import Select from "react-select";
import BtnSubmit from "../../components/Button/BtnSubmit";
import { MdOutlineArrowDropDown } from "react-icons/md";

const UpdateTripForm = () => {
  const navigate = useNavigate();
  //   update loader data
  const updateTripLoaderData = useLoaderData();
  const {
    id,
    transport_type,
    trip_date,
    trip_time,
    driver_name,
    vehicle_number,
    load_point,
    unload_point,
    driver_contact,
    driver_percentage,
    company_comission,
    fuel_price,
    gas_price,
    other_expenses,
    trip_price,
    demarage,
    customer,
    advance,
  } = updateTripLoaderData.data;
  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: {
      transport_type: transport_type || 0,
      trip_price: trip_price || 0,
      driver_name: driver_name || "",
      vehicle_number: vehicle_number || "",
      rate: updateTripLoaderData.data.rate || "",
      driver_percentage: driver_percentage || 0,
      company_comission: company_comission|| 0,
      fuel_price: fuel_price || 0,
      gas_price: gas_price || 0,
      demarage: demarage || 0,
      other_expenses: other_expenses || 0,
    },
  });

  const tripDateRef = useRef(null);
  // select driver
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
  }));

  const commision = parseFloat(watch("driver_percentage") || 0);
  const fuel = parseFloat(watch("fuel_price") || 0);
  const gas = parseFloat(watch("gas_price") || 0);
  const totalDamarage = parseFloat(watch("demarage") || 0);
  const other = parseFloat(watch("other_expenses") || 0);
  // const total = commision + fuel + gas + totalDamarage + other;
  // commission rate options
  const tripPrice = Number(watch("trip_price") || 0);
  const rate = Number(watch("rate") || 0);
  const selectedTransport = watch("transport_type");

  //  calculat comission
  useEffect(() => {
    // সব required value না থাকলে কিছু করবো না
    if (
      selectedTransport === undefined ||
      selectedTransport === "" ||
      tripPrice <= 0 ||
      rate <= 0
    ) {
      return;
    }

    const commission = (tripPrice * rate) / 100;

    if (selectedTransport === "Own Car") {
      setValue("driver_percentage", commission, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }

    if (selectedTransport === "Self Car") {
      setValue("company_comission", commission, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [tripPrice, rate, selectedTransport, setValue]);
  const driverCommission = parseFloat(watch("driver_percentage") || 0);
  const companyCommission = parseFloat(watch("company_comission") || 0);

  const total = driverCommission + fuel + gas + other;

  // submit function
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `https://pochao.tramessy.com/backend/api/trip/${id}`,
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
        navigate("/TripList");
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
                  type="time"
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
              <div className="mt-2 md:mt-1 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  ট্রান্সপোর্ট টাইপ <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("transport_type", { required: true })}
                  className="mt-1 w-full text-gray-500 text-sm border border-gray-300 bg-white p-2 rounded appearance-none outline-none"
                >
                  <option value={`${transport_type}`}>{transport_type}</option>
                  <option value="Own Car">নিজস্ব গাড়ী</option>
                  <option value="Self Car">সেল্প ড্রাইব</option>
                </select>
                <MdOutlineArrowDropDown className="absolute top-[35px] right-2 pointer-events-none text-xl text-gray-500" />
              </div>
              {selectedTransport === "Self Car" ? (
                <>
                  {/* Existing Vehicle Number Field */}
                  <div className="mt-2 md:mt-1 w-full relative">
                    <label className="text-primary text-sm font-semibold">
                      গাড়ির নম্বর <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("vehicle_number", { required: true })}
                      type="text"
                      placeholder="গাড়ির নম্বর দিন..."
                      className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                    />
                  </div>

                  {/* New Field directly after vehicle number */}
                  <div className="mt-2 md:mt-1 w-full relative">
                    <label className="text-primary text-sm font-semibold">
                      ড্রাইভারের নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("driver_name", { required: true })}
                      type="text"
                      placeholder="ড্রাইভারের নাম লিখুন..."
                      className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                    />
                  </div>

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
                </>
              ) : (
                /* Non-ভেন্ডরের গাড়ী Field (Select) */
                <>
                  {" "}
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
                            vehicleOptions.find((c) => c.value === value) ||
                            null
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
                  </div>
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
                </>
              )}

              {/* <div className="mt-2 md:mt-1 w-full relative">
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
              </div> */}
            </div>
            {/* <div className="md:flex justify-between gap-3">
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
            </div> */}
            <div className="mt-1 md:flex justify-between gap-3">
              {/* <div className="mt-2 md:mt-0 w-full relative">
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
              </div> */}
            </div>
          </div>
          {/*  */}

          <div className="mt-3 border border-gray-300 p-5 rounded-md">
            <h5 className="text-primary font-semibold text-center pb-5">
              <span className="py-2 border-b-2 border-primary">
                কাস্টমার এবং পেমেন্ট তথ্য
              </span>
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-3 justify-between gap-3">
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
               <div className="mt-2 md:mt-1 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  ওয়েটিং চার্জ
                </label>
                <input
                  {...register("demarage")}
                  defaultValue={demarage}
                  type="number"
                  placeholder="ওয়েটিং চার্জ..."
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
            <div className="grid grid-cols-2 md:grid-cols-3 justify-between gap-3">
              <div className="mt-2 md:mt-1 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  কমিশন রেট
                </label>
                <select
                  {...register("rate")}
                  className="mt-1 w-full text-gray-500 text-sm border border-gray-300 bg-white p-2 rounded appearance-none outline-none"
                >
                  <option value={`${rate}`}>{rate}%</option>
                  <option value="5">5%</option>
                  <option value="10">10%</option>
                  <option value="15">15%</option>
                  <option value="20">20%</option>
                  <option value="25">25%</option>
                  <option value="30">30%</option>
                  <option value="35">35%</option>
                </select>
                <MdOutlineArrowDropDown className="absolute top-[35px] right-2 pointer-events-none text-xl text-gray-500" />
              </div>
              {selectedTransport === "Own Car" ? (<div className="mt-2 md:mt-1 w-full relative">
                <label className="text-primary text-sm font-semibold">
                  ড্রাইভারের কমিশন <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("driver_percentage", { required: true })}
                  defaultValue={driver_percentage}
                  type="number"
                  placeholder="ড্রাইভারের কমিশন..."
                  readOnly
                  className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                />
              </div>) : (
                <div className="mt-2 md:mt-1 w-full relative">
                  <label className="text-primary text-sm font-semibold">
                    কোম্পানি কমিশন <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("company_comission", { required: true })}
                    defaultValue={company_comission}
                    type="number"
                    placeholder="কোম্পানি কমিশন..."
                    readOnly
                    className="mt-1 w-full text-sm border border-gray-300 px-3 py-2 rounded bg-white outline-none"
                  />
                </div>
              )}
              {selectedTransport === "Own Car" &&(<><div className="w-full relative">
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
              </>)}
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
