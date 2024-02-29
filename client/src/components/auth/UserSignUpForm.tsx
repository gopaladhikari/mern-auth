import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { registerSchemas } from "../../schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosInstance } from "../../conf/axios";
import { useState } from "react";
import { MdOutlineDone } from "react-icons/md";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

type FormData = z.infer<typeof registerSchemas>;

export default function UserSignUpForm() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchemas),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("avatar", data.avatar[0]);
    formData.append("phoneNumber", data.phoneNumber);

    try {
      const res = await axiosInstance.post("/user/register", formData);
      if (res.data) {
        setMessage(res.data.message);
        reset();
        setTimeout(() => {
          navigate("/");
        }, 5000);
      }
    } catch (error) {
      setError("root", {
        type: "manual",
        message: (error as Error).message ?? "Something went wrong",
      });
    }
  };

  return (
    <>
      <form
        className="space-y-5"
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
        <div>
          <label htmlFor="avatar" className="block mb-2 text-sm font-medium ">
            Avatar
          </label>
          <input
            type="file"
            id="avatar"
            className="block w-full p-2.5 focus:outline-none focus:border-b-primary bg-transparent border"
            placeholder="John"
            disabled={isSubmitting}
            {...register("avatar")}
          />
          {errors.avatar && (
            <p className="text-red-600 p-1">
              {errors.avatar?.message as string}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="firstName"
            className="block mb-2 text-sm font-medium "
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            className="block w-full p-2.5 focus:outline-none focus:border-b-primary bg-transparent border"
            placeholder="John"
            disabled={isSubmitting}
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-red-600 p-1">{errors.firstName?.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block mb-2 text-sm font-medium  focus:border-b-primary "
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            placeholder="Doe"
            disabled={isSubmitting}
            className="block w-full p-2.5 focus:outline-none focus:border-b-primary bg-transparent border"
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-red-600 p-1">{errors.lastName?.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium  focus:border-b-primary "
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="example@example.com"
            disabled={isSubmitting}
            className="block w-full p-2.5 focus:outline-none focus:border-b-primary bg-transparent border"
            {...register("email")}
          />

          {errors.email && (
            <p className="text-red-600 p-1">{errors.email?.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="phoneNumber"
            className="block mb-2 text-sm font-medium  focus:border-b-primary "
          >
            Phone Number
          </label>
          <PhoneInput
            inputClass="!w-full"
            country={"us"}
            onChange={(value) => setValue("phoneNumber", value)}
          />
          {errors.phoneNumber && (
            <p className="text-red-600 p-1">{errors.phoneNumber?.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium  focus:border-b-primary "
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="********"
            disabled={isSubmitting}
            className="block w-full p-2.5 focus:outline-none focus:border-b-primary bg-transparent border"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-600 p-1">{errors.password?.message}</p>
          )}
        </div>
        {errors.root && (
          <p className="text-[red] mt-2 ml-1"> {errors.root.message} </p>
        )}
        {message && (
          <p className="text-emerald-700 mt-2 ml-1 bg-emerald-100 px-4 py-2 flex gap-2 items-center ">
            <MdOutlineDone size={20} />
            {message}
          </p>
        )}
        <p className="font-normal">
          Already have an account?&nbsp;
          <Link to="/login" className="font-medium">
            <span className="text-blue-700 underline">Login here</span>
          </Link>
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-3 font-bold rounded-lg hover:bg-white border-2 border-white transition-all duration-400 ease-in-out hover:border-[#e4e4e4] hover:text-primary"
        >
          {isSubmitting ? "Loading..." : "Sign up"}
        </button>
      </form>
    </>
  );
}
