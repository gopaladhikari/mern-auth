import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { registerSchemas } from "../../schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";

type FormData = z.infer<typeof registerSchemas>;

const DB_URI = import.meta.env.VITE_DB_URI;

export default function UserSignUpForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchemas),
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("avatar", data.avatar[0]);
    startTransition(() => {
      (async () => {
        const res = await fetch(`${DB_URI}/api/v1/user/register`, {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Failed to register");

        const data = await res.json();

        console.log("data", data);
        reset();
      })();
    });
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
            disabled={isPending}
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
            disabled={isPending}
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
            disabled={isPending}
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
            disabled={isPending}
            className="block w-full p-2.5 focus:outline-none focus:border-b-primary bg-transparent border"
            {...register("email")}
          />{" "}
          {errors.email && (
            <p className="text-red-600 p-1">{errors.email?.message}</p>
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
            disabled={isPending}
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

        <p className="font-normal">
          Already have an account?&nbsp;
          <Link to="/login" className="font-medium">
            <span className="text-blue-700 underline">Login here</span>
          </Link>
        </p>
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-primary text-white py-3 font-bold rounded-lg hover:bg-white border-2 border-white transition-all duration-400 ease-in-out hover:border-[#e4e4e4] hover:text-primary"
        >
          {isPending ? "Loading..." : "Sign up"}
        </button>
      </form>
    </>
  );
}
