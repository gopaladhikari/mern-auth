import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchemas } from "../../schemas/loginSchema";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/authSlice";
import { axiosInstance } from "../../conf/axios";
import { useAppSelector } from "../../redux/store";
import { useEffect } from "react";
import { useCookies } from "react-cookie";

type FormData = z.infer<typeof loginSchemas>;

export default function UserLoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [_, setCookie] = useCookies(["refreshToken", "accessToken"]);

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchemas),
  });

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    const options = {
      secure: true,
      path: "/",
    };

    try {
      const res = await axiosInstance.post("/user/login", formData);
      if (res.data) {
        const { accessToken, refreshToken, user } = res.data.data;

        setCookie("refreshToken", refreshToken, {
          ...options,
          maxAge: 30 * 24 * 60 * 60,
        });
        setCookie("accessToken", accessToken, {
          ...options,
          maxAge: 24 * 60 * 60,
        });

        dispatch(login(user));
        navigate("/dashboard");
      }
    } catch (error) {
      setError("root", {
        type: "custom",
        message: (error as Error).message ?? "Invalid email or password",
      });
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
      {errors.root && (
        <p className="text-red-600 p-1">{errors.root?.message}</p>
      )}
      <div className="flex items-start">
        <Link
          to="/request-forgot-password"
          className="text-[13px] italic underline"
        >
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
        disabled={isSubmitting}
        className="w-full bg-primary text-white font-bold text-lg my-4 py-2"
      >
        {isSubmitting ? "Logging in" : "Login"}
      </button>
    </form>
  );
}
