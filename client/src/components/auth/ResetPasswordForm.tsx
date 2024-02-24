import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TResetPasswordSchema,
  resetPasswordSchema,
} from "../../schemas/resetPasswordSchema";
import { axiosInstance } from "../../conf/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPasswordForm({ token }: { token: string | null }) {
  const navigate = useNavigate();
  const [sucess, setSucess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit: SubmitHandler<TResetPasswordSchema> = async (formData) => {
    console.log(formData);
    try {
      const res = await axiosInstance.post("/user/reset-password", {
        ...formData,
        token,
      });

      if (res.statusText == "OK") {
        setSucess(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  if (sucess) {
    setTimeout(() => {
      navigate("/login");
    }, 5000);

    return (
      <section className="mx-auto max-w-lg p-4">
        <p className="text-center text-lg">
          Your password has been reset successfully
        </p>
      </section>
    );
  }

  return (
    <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6">
        <label htmlFor="email" className="block mb-2 text-sm font-medium ">
          Password
        </label>
        <input
          type="password"
          {...register("password")}
          className="bg-transparent border border-gray-300  text-sm rounded-lg focus:outline-none block w-full p-2.5"
          placeholder="example@gmail.com"
        />
        {errors.password && (
          <p className="text-red-600 p-1">{errors.password?.message}</p>
        )}
      </div>
      <div className="mb-6">
        <label htmlFor="password" className="block mb-2 text-sm font-medium ">
          Confirm password
        </label>
        <input
          type="password"
          {...register("confirmPassword")}
          placeholder="*********"
          className="bg-transparent focus:outline-none border border-gray-300  text-sm rounded-lg  block w-full p-2.5 "
        />
        {errors.confirmPassword && (
          <p className="text-red-600 p-1">{errors.confirmPassword?.message}</p>
        )}
      </div>
      {errors.root && (
        <p className="text-red-600 p-1">{errors.root?.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white font-bold text-lg my-4 py-2"
      >
        {isSubmitting ? "Loading..." : "Submit"}
      </button>
    </form>
  );
}
