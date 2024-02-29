import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosInstance } from "../conf/axios";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axiosInstance.post("/user/verify-email", {
          token,
        });

        if (res.data) navigate("/login");
      } catch (error) {
        throw new Error(`Failed to verify email ${error}`);
      }
    };
    verifyEmail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <main> token : {token} </main>;
}
