import { useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { registerSchemas } from "../../schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";

type FormData = z.infer<typeof registerSchemas>;

export default function UserSignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchemas),
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    startTransition(() => {
      (async () => {
        const res = await fetch("/api/v1/users/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Failed to register");
      })();
    });
  };

  return (
    <>
      <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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
          />{" "}
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
          Sign up
        </button>
      </form>
    </>
  );
}
