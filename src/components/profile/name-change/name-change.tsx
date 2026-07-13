"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";

interface ChangePasswordProps {
  email: string;
}

const Changename: React.FC<ChangePasswordProps> = ({ email }) => {
  const [name, setname] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/client/change-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (response.status === 200) {
        toast.success(data.message || "Password changed successfully!");
        window.location.replace("/");
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
      <div className="max-w-[350px] md:max-w-[400px] mx-auto p-6 bg-white rounded-2xl ">
        <h2 className="text-blavk font-semibold text-2xl mb-6 text-center">
          Change Name
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-normal text-black">
              New Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="text"
                value={name}
                onChange={(e) => setname(e.target.value)}
                required
                minLength={6}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 text-black font-normal rounded-md shadow-sm focus:outline-none focus:ring-[#136499] focus:border-[#136499]"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading ? "bg-gray-400" : "bg-black"
              } focus:outline-none focus:ring-2 focus:ring-black focus:border-black`}
            >
              {loading ? "Changing..." : "Change Name"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Changename;
