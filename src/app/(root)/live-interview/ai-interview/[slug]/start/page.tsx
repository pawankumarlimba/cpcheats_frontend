"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import QuestionsSection from "@/components/live-interview/ai-live-interview/start";
import RecordAnswerSection from "@/components/live-interview/ai-live-interview/record-answer-section";
import axios from "axios";

// Define the type for the interview data
interface InterviewData {
  mockId: string;
  jsonMockResp: string;
  jobPosition: string;
  jobDesc: string;
  jobExperience: string;
  createdBy: string;
  createdAt: string;
}

// Define the type for the question data
interface Question {
  question: string;
  answer: string;
}

// Define the type for the component props
interface Params {
  slug: string;
}

const StartInterview=({ params }: { params: Promise<Params> }) => {
  // Unwrap the params object using React.use()
  const { slug } = React.use(params);

  const [interviewData, setInterviewData] = useState<InterviewData>({
    mockId: "",
    jsonMockResp: "",
    jobPosition: "",
    jobDesc: "",
    jobExperience: "",
    createdBy: "",
    createdAt: "",
  });
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState<Question[]>([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);

  // Fetch interview details when the component mounts
  useEffect(() => {
    GetInterviewDetails(slug);
  }, [slug]); // Add slug as a dependency

  // Fetch interview details from the API


  const GetInterviewDetails = async (slug: string) => {
    try {
      // Make a POST request using Axios
      const response = await axios.post("/api/ai-interview/find", { slug });
  
      // Extract the response data
      const data = response.data;
  
      if (data.success) {
        const jsonMockResp: Question[] = JSON.parse(data.data.jsonMockResp);
        console.log("🚀 ~ GetInterviewDetails ~ jsonMockResp:", jsonMockResp);
  
        setMockInterviewQuestion(jsonMockResp);
        setInterviewData(data.data);
      } else {
        console.error("Interview not found:", data.error);
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };

  return (
    <div className="container-fluid pt-[100px] pb-[30px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Questions Section */}
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />

        {/* Video or Audio Recording Section */}
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>

      <div className="flex justify-end gap-6 mt-4">
        {/* Previous Question Button */}
        {activeQuestionIndex > 0 && (
          <Button className="shadow-xl bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99]" onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>
            Previous Question
          </Button>
        )}

        {/* Next Question Button */}
        {activeQuestionIndex !== mockInterviewQuestion.length - 1 && (
          <Button className="shadow-xl bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99]" onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>
            Next Question
          </Button>
        )}

        {/* End Interview Button */}
        {activeQuestionIndex === mockInterviewQuestion.length - 1 && (
          <Link href={`/live-interview/ai-interview/${interviewData?.mockId}/feedback`}>
            <Button className="shadow-xl bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99]">End Interview</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default StartInterview;