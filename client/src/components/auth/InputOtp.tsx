import {
  ElementRef,
  useEffect,
  useRef,
  useState,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import { axiosInstance } from "../../conf/axios";
import { useDispatch } from "react-redux";
import { setIsPhoneNumberVerified } from "../../redux/slices/authSlice";

export function InputOtp() {
  const dispatch = useDispatch();

  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<ElementRef<"input">[] | null>([]);

  useEffect(() => {
    if (inputRefs.current && inputRefs.current[0])
      inputRefs?.current[0].focus();
  }, []);

  const onOtpSubmit = async (otp: string) => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/user/verify-phone-number", {
        otp,
      });
      if (res.data) dispatch(setIsPhoneNumberVerified(true));
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === 6) onOtpSubmit(combinedOtp);

    if (
      inputRefs.current &&
      value &&
      index < length - 1 &&
      inputRefs.current[index + 1]
    ) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleClick = (index: number) => {
    if (inputRefs.current) inputRefs.current[index].setSelectionRange(1, 1);

    if (inputRefs.current && index > 0 && !otp[index - 1])
      inputRefs.current[otp.indexOf("")].focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (
      inputRefs.current &&
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      // Move focus to the previous input field on backspace
      inputRefs.current[index - 1].focus();
    }
  };
  return (
    <section className="space-y-4">
      <h2 className="text-center text-3xl mt-8 font-semibold">
        Enter your otp code
      </h2>
      <div className="flex items-center gap-4">
        {otp.map((value, index) => {
          return (
            <input
              key={index}
              type="text"
              ref={(input) => {
                if (inputRefs.current)
                  inputRefs.current[index] = input as HTMLInputElement;
              }}
              value={value}
              onChange={(e) => handleChange(index, e)}
              onClick={() => handleClick(index)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center outline outline-2 outline-slate-800"
            />
          );
        })}
      </div>
      <button
        disabled={loading}
        className="w-full bg-primary text-white font-bold text-lg my-4 py-2"
      >
        {loading ? "loading..." : "Submit"}
      </button>
    </section>
  );
}
