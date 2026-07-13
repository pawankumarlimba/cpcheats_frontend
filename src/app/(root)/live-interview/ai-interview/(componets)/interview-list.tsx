"use client";
import { useEffect, useState } from "react";
import InterviewItemCard from "./interview-item-card";
import axios from "axios";
import { toast } from "react-toastify";
import { getCookie } from "@/lib/cookies";

// Define the type for the interview object
interface Interview {
  mockId: string;
  jobPosition: string;
  jobExperience: string;
  createdAt: string;
  createdBy: string;
}

// Define the type for the user object
interface IUser {
  username: string;
  name: string;
  email: string;
  accessToken: string;
}

const InterviewList: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [interviewList, setInterviewList] = useState<Interview[]>([]);

  // Fetch user details from cookies and API
  useEffect(() => {
    const logintoken = getCookie("token1");
    if (logintoken) {
      findUser(logintoken);
    }
  }, []);

  // Fetch user details using the access token
  const findUser = async (accessToken: string) => {
    try {
      const response = await axios.post("/api/client/finduser", { accessToken });
      if (response.data.success) {
        setUser(response.data.user);
  
      } else {
        toast.error(response.data.error || "An error occurred");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "An error occurred");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  // Fetch interview list when the user is available
  useEffect(() => {
    if (user) {
      GetInterviewList();
    }
  }, [user]);

  // Fetch interview list from the API
  const GetInterviewList = async () => {
    try {
      const response = await axios.post("/api/ai-interview/list", {
        createdBy: user?.email,
      });

      if (response.data.success) {
        // Update state with the fetched interviews
        setInterviewList(response.data.data);
      } else {
        throw new Error("Failed to fetch interview list");
      }
    } catch (error) {
      console.error("Error fetching interview list:", error);
      toast.error("An error occurred while fetching the interview list.");
    }
  };

  return (
    <div>
      <h2 className="font-medium text-xl">Previous Mock Interviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
        {interviewList.map((interview, index) => (
          <InterviewItemCard interview={interview} key={index} />
        ))}
      </div>
    </div>
  );
};

export default InterviewList;