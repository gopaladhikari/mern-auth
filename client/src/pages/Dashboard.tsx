import { useAppSelector } from "../redux/store";
import { useDispatch } from "react-redux";
import { showChangePasswordForm } from "../redux/slices/changePasswordSlice";
import { ChangePasswordForm } from "../components/auth/ChangePasswordForm";

export default function Dashboard() {
  const dispatch = useDispatch();

  const { firstName, lastName, avatar, email } = useAppSelector(
    (state) => state.auth
  );

  const { isShowChangePassword, isChangePasswordSucess } = useAppSelector(
    (state) => state.changePassword
  );

  return (
    <main>
      <h1 className="text-center text-3xl font-bold underline mt-8">Welcome</h1>
      <div className="flex justify-center items-center flex-col mt-8">
        <img src={avatar} alt="avatar" className="w-16 h-16 rounded-full" />
        <p>
          {firstName} {lastName}
        </p>
        <p>{email}</p>

        {isShowChangePassword && <ChangePasswordForm />}

        {isChangePasswordSucess && (
          <div className="bg-emerald-500 text-white py-3 rounded my-4 px-12">
            <p>Password changed sucessfully</p>
          </div>
        )}

        <div className="mt-12">
          <button
            type="button"
            className={`${
              isShowChangePassword
                ? "bg-red-500 hover:bg-red-700"
                : "bg-blue-500 hover:bg-blue-700"
            } text-white font-bold py-2 px-4 rounded`}
            onClick={() => dispatch(showChangePasswordForm())}
          >
            {isShowChangePassword ? "Cancel" : "Change Password"}
          </button>
        </div>
      </div>
    </main>
  );
}
