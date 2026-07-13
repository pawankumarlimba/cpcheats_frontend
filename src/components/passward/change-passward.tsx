"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

interface ChangePasswordProps {
  email: string;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ email }) => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      toast.error("password is small ");
      setLoading(false);
      return;
    }
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/client/changePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        toast.success(data.message || "Password changed successfully!");
        window.location.replace("/login");
      } else {
        toast.error(data.error || "Error changing password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Error changing password. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="max-w-[350px] md:max-w-[400px] mx-auto p-6 bg-white rounded-2xl font-normal">
        <h2 className="font-semibold text-black text-2xl mb-6 text-center">
          Change Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-normal text-black">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 text-black rounded-md shadow-sm "
              />
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-normal text-black">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 text-black rounded-md shadow-sm "
            />
          </div>
          <label className="mt-2 flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="ml-1"
                />
                <span className="text-sm text-black">Show Password</span>
              </label>
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading ? "bg-gray-400" : "bg-black"
              } focus:outline-none `}
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
