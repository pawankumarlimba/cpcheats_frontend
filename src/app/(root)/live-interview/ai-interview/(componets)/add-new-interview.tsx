"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import { chatSession } from "@/lib/GeminiAIModal";
import {jsonrepair} from "jsonrepair"; 
import { getCookie } from "@/lib/cookies"; 

// User Interface
interface IUser {
  username: string;
  name: string;
  email: string;
  accessToken: string;
}

// Question Interface
interface IQuestion {
  question: string;
  answer: string;
}

const AddNewInterview: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Fetch user details from cookies and API
  useEffect(() => {
    const logintoken = getCookie("token1");
    if (logintoken) {
      findUser(logintoken);
      setIsLoggedIn(true);
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

  // Handle form submission
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const inputPrompt = `Job position: ${jobPosition}, Job Description: ${jobDescription}, Years of Experience: ${jobExperience}. Based on these details, generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions along with answers in JSON format. 
    Each question should be structured as follows:
    [
      {
        "question": "Your question here",
        "answer": "Your answer here"
      }
    ]`;

    try {
      // Send input to AI model
      const result = await chatSession.sendMessage(inputPrompt);
      const responseText = await result.response.text();

      //console.log("Raw AI Response:", responseText); // Log the raw response

      // Repair malformed JSON using jsonrepair
      const repairedJson = jsonrepair(responseText);
      //console.log("Repaired JSON:", repairedJson); // Log the repaired JSON

      // Parse the JSON response
      const mockResponse: IQuestion[] = JSON.parse(repairedJson);

      // Generate a unique ID for the interview
      const mockId = uuidv4();

      // Save to MongoDB via API
      const saveResponse = await axios.post("/api/ai-interview/save", {
        mockId,
        jsonMockResp: JSON.stringify(mockResponse),
        jobPosition,
        jobDesc: jobDescription,
        jobExperience,
        createdBy: user?.email,
      });

      if (saveResponse.data.success) {
        router.push(`/live-interview/ai-interview/${mockId}`);
        toast.success("Interview created successfully!");
      } else {
        throw new Error("Failed to save interview");
      }
    } catch (error) {
      console.error("❌ Error fetching or saving interview questions:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h1 className="font-bold text-lg text-center">+ Add New</h1>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">
              Tell us more about your job Interviewing
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <form onSubmit={onSubmit}>
              <div>
                <p>Add details about your job position, description, and experience</p>

                <div className="mt-7 my-3">
                  <label>Job Role/Job Position</label>
                  <Input
                    placeholder="Ex. Full Stack Developer"
                    required
                    value={jobPosition}
                    onChange={(e) => setJobPosition(e.target.value)}
                  />
                </div>

                <div className="my-3">
                  <label>Job Description/Tech Stack (In short)</label>
                  <Textarea
                    placeholder="Ex. React, Angular, NodeJs, MySql etc"
                    required
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>

                <div className="my-3">
                  <label>Years of Experience</label>
                  <Input
                    placeholder="Ex. 5"
                    type="number"
                    min="1"
                    max="70"
                    required
                    value={jobExperience}
                    onChange={(e) => setJobExperience(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-5 justify-end">
                <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                  Cancel
                </Button>
                {isLoggedIn ? (
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" /> Generating from AI
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => router.push("/login")} // Redirect to login page
                  >
                    Login to Start Interview
                  </Button>
                )}
              </div>
            </form>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;