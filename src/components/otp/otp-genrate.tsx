"use client";

import { useState } from "react";
import { toast } from "react-toastify";

interface OTPFormProps {
  email: string;
  setEmail: (email: string) => void;
  onOTPGenerated: () => void;
}

const OTPForm: React.FC<OTPFormProps> = ({ email, setEmail, onOTPGenerated }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/client/sendotp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.status === 200) {
        toast.success(data.message || "OTP sent successfully!");
        onOTPGenerated();
      } else {
        toast.error(data.error || "An error occurred");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="max-w-[350px] md:max-w-[400px] mx-auto p-6 rounded-2xl ">
        <h2 className="text-black font-normal text-2xl mb-6 text-center">
          Verify Email
        </h2>

        <form onSubmit={handleSendOTP} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-normal text-black">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full text-black font-normal px-3 py-2 rounded-md shadow-sm focus:outline-none "
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading ? "bg-gray-400" : "bg-black"
              } focus:outline-none `}
            >
              {loading ? "OTP generating..." : "Generate OTP"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPForm;
