import { useState, MouseEvent } from "react";
import { FaLock } from "react-icons/fa";
import { axiosInstance } from "../conf/axios";
import { MdOutlineDone } from "react-icons/md";

export default function RequestForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleClick = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await axiosInstance.post(
        "/api/v1/user/request-forgot-password",
        {
          email,
        }
      );
      if (res.statusText === "OK") {
        setMessage(res.data.message);
        setEmail("");
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center flex-col gap-2">
      <FaLock size={45} className="text-green-700" />
      <p>Please enter your email address to receive a verification code</p>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="border-2 focus:outline-none border-green-400 min-w-96 px-2 py-1"
      />

      <button
        onClick={handleClick}
        disabled={loading}
        type="button"
        className="bg-green-600 text-white px-12 py-2 text-xl rounded"
      >
        {loading ? "Loading..." : " Submit"}
      </button>
      {message && (
        <p className="text-emerald-700 mt-2 ml-1 bg-emerald-100 px-4 py-2 flex gap-2 items-center ">
          <MdOutlineDone size={20} />
          {message}
        </p>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </main>
  );
}
