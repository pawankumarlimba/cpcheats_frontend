"use client";
import OTPValidationForm from "@/components/otp/otpverify";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Changeemail from "../email-change/email-change";

interface ChangePasswordProps {
  email: string;
}

const EmailFlow: React.FC<ChangePasswordProps> = ({ email }) => {
  const [otpVerified, setOtpVerified] = useState(false);

  const handleSendOTP = async (email:string) => {

    if (!email || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      toast.error("Please enter a valid email address.");
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
      } else {
        toast.error(data.error || "An error occurred");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const hasSentOTP = useRef(false);

  useEffect(() => {
    if (!hasSentOTP.current) {
      handleSendOTP(email);
      hasSentOTP.current = true;
    }
  }, [email]);

  const handleOTPVerified = () => {
    setOtpVerified(true);
  };

  return (
    <div >
      {!otpVerified && (
        <OTPValidationForm email={email} onOTPVerified={handleOTPVerified} />
      )}

      {otpVerified && <Changeemail email={email} />}
    </div>
  );
};

export default EmailFlow;
