import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchemas } from "../../schemas/loginSchema";
import { z } from "zod";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/authSlice";
import { User } from "../../types";

type FormData = z.infer<typeof loginSchemas>;

export default function UserLoginForm() {
  const [isPending, setIsPending] = useState(false);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchemas),
  });

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      setIsPending(true);
      const res = await fetch("/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const { data }: { data: User } = await res.json();
      if (!res.ok) throw new Error("Failed to login");
      reset();
      const {
        user: { _id, firstName, lastName, email, avatar },
        accessToken,
        refreshToken,
      } = data;

      dispatch(
        login({
          _id,
          firstName,
          lastName,
          email,
          avatar,
          accessToken,
          refreshToken,
        })
      );
    } catch (error) {
      throw new Error("Failed to login");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6">
        <label htmlFor="email" className="block mb-2 text-sm font-medium ">
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register("email")}
          className="bg-transparent border border-gray-300  text-sm rounded-lg focus:outline-none block w-full p-2.5"
          placeholder="example@gmail.com"
        />
        {errors.email && (
          <p className="text-red-600 p-1">{errors.email?.message}</p>
        )}
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block mb-2 text-sm font-medium ">
          Password
        </label>
        <input
          type="password"
          id="password"
          {...register("password")}
          placeholder="*********"
          className="bg-transparent focus:outline-none border border-gray-300  text-sm rounded-lg  block w-full p-2.5 "
        />
        {errors.password && (
          <p className="text-red-600 p-1">{errors.password?.message}</p>
        )}
      </div>
      <div className="flex items-start">
        <Link to="f/orgot-password" className="text-[13px] italic">
          Forgot Password
        </Link>
      </div>

      <p className="text-base font-medium text-center">
        Don&rsquo;t have an account?&nbsp;
        <Link className="text-blue-700 underline" to="/register">
          Sign up
        </Link>
      </p>
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-primary text-white font-bold text-lg my-4 py-2"
      >
        {isPending ? "Logging in" : "Login"}
      </button>
    </form>
  );
}
