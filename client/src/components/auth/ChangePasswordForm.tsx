import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  showNewPassword,
  showConfirmPassword,
  showOldPassword,
  changePasswordSucess,
  showChangePasswordForm,
} from "../../redux/slices/changePasswordSlice";
import { TPassowrd, passwordSchemas } from "../../schemas/passwordSchemas";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../redux/store";
import { axiosInstance } from "../../conf/axios";

export function ChangePasswordForm() {
  const { changePassword } = useAppSelector((state) => state);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TPassowrd>({
    resolver: zodResolver(passwordSchemas),
  });

  const onSubmit: SubmitHandler<TPassowrd> = async (formData) => {
    try {
      const res = await axiosInstance.post("/user/change-password", formData);
      if (res.statusText === "OK") {
        dispatch(changePasswordSucess(true));
        reset();
        dispatch(showChangePasswordForm());
        setTimeout(() => {
          dispatch(changePasswordSucess(false));
        }, 3000);
      } else dispatch(changePasswordSucess(false));
    } catch (error) {
      dispatch(changePasswordSucess(false));
      setError("root", {
        type: "manual",
        message: (error as Error).message,
      });
    }
  };

  return (
    <section>
      {changePassword.showChangePassword && (
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-4 items-center">
            <label htmlFor="oldPassword">Old password</label>
            <div className="flex items-center gap-2 border p-2">
              <input
                className="focus:outline-none rounded-md"
                type={changePassword.showOldPassword ? "text" : "password"}
                id="oldPassword"
                {...register("oldPassword")}
                placeholder="Enter old password"
              />
              <button type="button" onClick={() => dispatch(showOldPassword())}>
                {changePassword.showOldPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {errors.oldPassword && (
            <p className="text-red-700">{errors.oldPassword.message}</p>
          )}
          <div className="flex gap-4 items-center">
            <label htmlFor="password">New password</label>
            <div className="flex items-center gap-2 border p-2">
              <input
                className="focus:outline-none rounded-md"
                type={changePassword.showNewPassword ? "text" : "password"}
                id="password"
                {...register("newPassword")}
                placeholder="Enter new password"
              />
              <button type="button" onClick={() => dispatch(showNewPassword())}>
                {changePassword.showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          {errors.newPassword && (
            <p className="text-red-700">{errors.newPassword.message}</p>
          )}

          <div className="flex gap-4 items-center">
            <label htmlFor="changePassword">Confirm password</label>
            <div className="flex items-center border p-2">
              <input
                className="focus:outline-none rounded-md"
                type={changePassword.showConfirmPassword ? "text" : "password"}
                id="changePasswordpassword"
                {...register("confirmPassword")}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => dispatch(showConfirmPassword())}
              >
                {changePassword.showConfirmPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            </div>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-700">{errors.confirmPassword.message}</p>
          )}
          {errors.root && <p className="text-red-700">{errors.root.message}</p>}

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isSubmitting ? "Loading..." : " Submit"}
          </button>
        </form>
      )}
      {changePassword.changePasswordSucess && (
        <div className="bg-emerald-500 text-white py-3 rounded my-4 px-12">
          <p>Password change sucessfully</p>
        </div>
      )}
    </section>
  );
}
