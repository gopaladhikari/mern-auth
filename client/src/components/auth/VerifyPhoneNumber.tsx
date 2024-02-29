import { axiosInstance } from "../../conf/axios";
import { useForm } from "react-hook-form";
import { useAppSelector } from "../../redux/store";
import { InputOtp } from "./InputOtp";
import { useDispatch } from "react-redux";
import { setOtpSent } from "../../redux/slices/authSlice";

type Props = {
  phoneNumber: string;
};

export function VerifyPhoneNumber({ phoneNumber }: Props) {
  const dispatch = useDispatch();
  const { otpSent } = useAppSelector((state) => state.auth);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const handleVerifyPhoneNumber = async () => {
    try {
      const res = await axiosInstance.post(
        "/user/request-verify-phone-number",
        {
          phoneNumber,
        }
      );

      if (res.data) dispatch(setOtpSent(true));
    } catch (error) {
      throw new Error(`Failed to verify phone number ${error}`);
    }
  };

  if (otpSent) return <InputOtp />;

  return (
    <form onSubmit={handleSubmit(handleVerifyPhoneNumber)}>
      <button
        type="submit"
        disabled={isSubmitting}
        onClick={handleVerifyPhoneNumber}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6"
      >
        Verify Phone Number
      </button>
    </form>
  );
}
