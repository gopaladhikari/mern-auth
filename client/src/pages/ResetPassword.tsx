import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { axiosInstance } from "../conf/axios";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const resetPassword = async () => {
      const res = await axiosInstance.post("/api/v1/user/reset-password", {
        token,
      });
      console.log(res);
    };

    resetPassword();
  }, [token]);
  return (
    <main className="mt-8">
      <section className="mx-auto max-w-lg p-4">
        <h3 className="font-bold leading-tight text-center text-3xl">
          Reset Password
        </h3>
        <ResetPasswordForm token={token} />
      </section>
    </main>
  );
}
