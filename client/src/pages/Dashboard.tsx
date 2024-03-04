import { useAppSelector } from "../redux/store";
import { useDispatch } from "react-redux";
import { showChangePasswordForm } from "../redux/slices/changePasswordSlice";
import { ChangePasswordForm } from "../components/auth/ChangePasswordForm";
import { VerifyPhoneNumber } from "../components/auth/VerifyPhoneNumber";
import { axiosInstance } from "../conf/axios";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/slices/authSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    firstName,
    lastName,
    avatar,
    email,
    phoneNumber,
    isPhoneNumberVerified,
  } = useAppSelector((state) => state.auth);

  const { isShowChangePassword, isChangePasswordSucess } = useAppSelector(
    (state) => state.changePassword
  );

  const handleDelete = async () => {
    const res = await axiosInstance.delete("/user/delete-account");

    if (res.data) {
      navigate("/");
      dispatch(logout());
    }
  };

  return (
    <main>
      <h1 className="text-center text-3xl font-bold underline mt-8">Welcome</h1>
      <div className="flex justify-center items-center flex-col mt-8">
        <img src={avatar} alt="avatar" className="w-16 h-16 rounded-full" />
        <p>
          {firstName} {lastName}
        </p>
        <p>{email}</p>
        <p>
          +{phoneNumber}
          <span
            className={`${
              isPhoneNumberVerified ? "text-green-500" : "text-red-500"
            } mx-3`}
          >
            {isPhoneNumberVerified ? "✅" : "❌"}
          </span>
        </p>

        {isShowChangePassword && <ChangePasswordForm />}

        {isChangePasswordSucess && (
          <div className="bg-emerald-500 text-white py-3 rounded my-4 px-12">
            <p>Password changed sucessfully</p>
          </div>
        )}

        {!isPhoneNumberVerified && (
          <VerifyPhoneNumber phoneNumber={phoneNumber} />
        )}

        <div className="mt-6">
          <button
            type="button"
            className={`${
              isShowChangePassword
                ? "bg-red-500 hover:bg-red-700"
                : "bg-blue-500 hover:bg-blue-700"
            } text-white font-bold py-2 px-4 rounded`}
            onClick={() => dispatch(showChangePasswordForm())}
          >
            {isShowChangePassword ? "Loading..." : "Change Password"}
          </button>
        </div>
        <button
          type="button"
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-7 rounded mt-4"
          onClick={handleDelete}
        >
          {isShowChangePassword ? "Cancel" : "Delete Account"}
        </button>
      </div>
    </main>
  );
}
