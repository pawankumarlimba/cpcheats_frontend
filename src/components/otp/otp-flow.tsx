"use client";
import { useState } from "react";
import ChangePassword from "../passward/change-passward";
import OTPForm from "./otp-genrate";
import OTPValidationForm from "./otpverify";


const PasswordFlow = () => {
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [email, setEmail] = useState(''); 

  const handleOTPGenerated = () => {
    setOtpGenerated(true);
  };

  const handleOTPVerified = () => {
    setOtpVerified(true);
  };

   
  return (
    <div >
      {!otpGenerated && !otpVerified && (
        <OTPForm email={email} setEmail={setEmail} onOTPGenerated={handleOTPGenerated} />
      )}

      {otpGenerated && !otpVerified && (
        <OTPValidationForm email={email} onOTPVerified={handleOTPVerified} />
      )}

      {otpVerified && <ChangePassword email={email} />}
    </div>
  );
};

export default PasswordFlow;
