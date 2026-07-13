"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Info, Lightbulb, Video, VideoOff, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

// Define the type for the interview data
interface InterviewData {
  mockId: string;
  jobPosition: string;
  jobDesc: string;
  jobExperience: string;
}

// Define the type for the params
interface Params {
  slug: string;
}

export default function Interview({ params }: { params: Promise<Params> }) {
  // Unwrap the params object using React.use()
  const { slug } = React.use(params);

  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
  const [webCamEnabled, setWebCamEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch interview details when the component mounts
  useEffect(() => {
    GetInterviewDetails(slug);
  }, [slug]); // Add slug as a dependency

  // Fetch interview details from the API


  const GetInterviewDetails = async (slug: string) => {
    setIsLoading(true);
    try {
      // Make a POST request using Axios
      const response = await axios.post("/api/ai-interview/find", { slug });
  
      // Extract the response data
      const data = response.data;
      console.log(data);
  
      if (data.success) {
        setInterviewData({
          mockId: data.data.mockId,
          jobPosition: data.data.jobPosition,
          jobDesc: data.data.jobDesc,
          jobExperience: data.data.jobExperience,
        });
      } else {
        console.error("Interview not found:", data.error);
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Extract tech stack from job description
  const extractTechStack = (jobDesc: string | undefined) => {
    if (!jobDesc) return [];

    // Common tech keywords to look for
    const techKeywords = [
      "JavaScript",
      "TypeScript",
      "React",
      "Vue",
      "Angular",
      "Node.js",
      "Python",
      "Java",
      "C#",
      ".NET",
      "PHP",
      "Ruby",
      "Go",
      "Rust",
      "AWS",
      "Azure",
      "GCP",
      "Docker",
      "Kubernetes",
      "SQL",
      "NoSQL",
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "Redis",
      "GraphQL",
      "REST",
    ];

    // Find matches in the job description
    return techKeywords.filter((tech) => jobDesc.toLowerCase().includes(tech.toLowerCase()));
  };

  const techStack = extractTechStack(interviewData?.jobDesc);

  return (
    <div className="container-fluid pt-[100px] mb-[50px]">
      <div className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Interview Preparation</h1>
        <p className="text-muted-foreground max-w-2xl">
          Review your job details and prepare for your AI interview session. Make sure your camera and microphone are
          working properly before starting.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Details Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/40">
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Job Details
              </CardTitle>
              <CardDescription>Information about the position you &apos; re interviewing for</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="space-y-4">
                  <div className="h-6 bg-muted rounded animate-pulse w-3/4"></div>
                  <div className="h-20 bg-muted rounded animate-pulse"></div>
                  <div className="h-6 bg-muted rounded animate-pulse w-1/2"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Job Position</h3>
                    <p className="text-xl font-semibold">{interviewData?.jobPosition || "Not specified"}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Job Description</h3>
                    <p className="text-base">{interviewData?.jobDesc || "Not specified"}</p>

                    {techStack.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Tech Stack</h4>
                        <div className="flex flex-wrap gap-2">
                          {techStack.map((tech, index) => (
                            <Badge key={index} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Experience Level</h3>
                    <p className="text-base font-medium">{interviewData?.jobExperience || "Not specified"} years</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <Lightbulb className="h-5 w-5" />
                Tips for Success
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-700 dark:text-amber-400 space-y-4">
              <p>
                {process.env.NEXT_PUBLIC_INFORMATION ||
                  "Speak clearly and confidently. Take your time to think before answering. Focus on specific examples from your experience."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Prepare specific examples of your past work</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Research common questions for this role</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Test your microphone before starting</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>Find a quiet environment with good lighting</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Webcam Section */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/40">
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Camera Preview
              </CardTitle>
              <CardDescription>Check how you appear on camera before starting</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {webCamEnabled ? (
                <div className="relative bg-black aspect-video flex items-center justify-center">
                  <Webcam
                    onUserMedia={() => setWebCamEnabled(true)}
                    onUserMediaError={() => setWebCamEnabled(false)}
                    mirrored={true}
                    className="w-full h-auto"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setWebCamEnabled(false)}
                    className="absolute bottom-4 right-4 bg-background/80 hover:bg-background"
                  >
                    Disable Camera
                  </Button>
                </div>
              ) : (
                <div className="bg-muted aspect-video flex flex-col items-center justify-center p-6 text-center">
                  <VideoOff className="h-16 w-16 mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-2">Camera is currently disabled</p>
                  <Button variant="outline" onClick={() => setWebCamEnabled(true)} className="mt-2">
                    Enable Camera
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Ready to begin?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Once you start the interview, you&apos;ll be asked a series of questions related to the job position. Your
                responses will be recorded and analyzed.
              </p>

              <Link href={`/live-interview/ai-interview/${slug}/start`} className="w-full">
                <Button
                  size="lg"
                  className="w-full shadow-xl bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99] transition-all"
                >
                  Start Interview
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}