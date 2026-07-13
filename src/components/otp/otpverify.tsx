"use client";
import { useState } from 'react';
import { toast } from 'react-toastify'; 

type OTPValidationFormProps = {
  email: string;
  onOTPVerified: () => void;
};

const OTPValidationForm: React.FC<OTPValidationFormProps> = ({ email, onOTPVerified }) => {
  const [otpInput, setOtpInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleValidateOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); 

    try {
      const response = await fetch('/api/client/otpvarify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otpInput }),
      });

      const data = await response.json();

      if (response.status === 200) {
        toast.success('OTP validated successfully. You can now change your password.');
        onOTPVerified();
      } else {
        toast.error(data.error || 'Invalid or expired OTP');
      }
    } catch (error) {
      console.error('Error validating OTP:', error);
      toast.error('Error validating OTP. Please try again.');
    }
    setLoading(false); 
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
        <h2 className="text-2xl font-semibold text-center text-black">Validate OTP</h2>
        <form onSubmit={handleValidateOTP} className="space-y-4">
          <div>
            <label htmlFor="otpInput" className="block text-sm font-medium text-black">OTP</label>
            <input
              type="text"
              id="otpInput"
              placeholder="Enter OTP"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              required
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none font-normal"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                loading ? 'bg-gray-400' : 'bg-black'
              } focus:outline-none focus:ring-2 `}
            >
              {loading ? 'Validating...' : 'Validate OTP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OTPValidationForm;
