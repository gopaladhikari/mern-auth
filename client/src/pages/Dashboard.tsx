import { useAppSelector } from "../redux/store";
import { useDispatch } from "react-redux";
import { showChangePasswordForm } from "../redux/slices/changePasswordSlice";
import { ChangePasswordForm } from "../components/auth/ChangePasswordForm";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { auth, changePassword } = useAppSelector((state) => state);

  return (
    <main>
      <h1 className="text-center text-3xl font-bold underline mt-8">Welcome</h1>
      <div className="flex justify-center items-center flex-col mt-8">
        <img
          src={auth.avatar}
          alt="avatar"
          className="w-16 h-16 rounded-full"
        />
        <p>
          {auth.firstName} {auth.lastName}
        </p>
        <p>{auth.email}</p>

        <ChangePasswordForm />

        <div className="mt-12">
          <button
            type="button"
            className={`${
              changePassword.showChangePassword
                ? "bg-red-500 hover:bg-red-700"
                : "bg-blue-500 hover:bg-blue-700"
            } text-white font-bold py-2 px-4 rounded`}
            onClick={() => dispatch(showChangePasswordForm())}
          >
            {changePassword.showChangePassword ? "Cancel" : "Change Password"}
          </button>
        </div>
      </div>
    </main>
  );
}
