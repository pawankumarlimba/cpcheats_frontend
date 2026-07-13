"use client";

import { notFound } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DiscussionForum from "@/components/comment-section/comment-show";
import { SiLeetcode } from "react-icons/si";
import ProgressTracker from "../progres/progres";
import { getCookie } from "@/lib/cookies";


interface Params {
  slug: string;
}

interface Data {
  _id: string;
  topicname: string;
  slug: string;
  details: string;
  freqquestion: {
    question: string;
    answer: string;
  }[];
  problems: {
    problemid: string;
  }[];
}

interface ProblemData {
  _id: string;
  problemtitle: string;
  difficulty: "Easy" | "Medium" | "Hard";
  
sheets: {
    name: string;
  };
  ischeack: {
    user: string;
  }[];
  leetcodeLink: string;
}

interface Params {
  slug: string;
}
interface countdata{
 solve:number;
 total:number
}

export default function Interview({ params }: { params: Promise<Params> }) {
   const { slug } = React.use(params);
  const [checkedProblems, setCheckedProblems] = useState<Record<string, boolean>>({});
  const [problems, setProblems] = useState<ProblemData[] | null>(null);
  const [post, setPost] = useState<Data | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setuser] = useState();
  const [count, setcount] = useState<countdata>();




  useEffect(() => {

    const logintoken = getCookie('token1');
    if (logintoken) {
      //console.log(logintoken)
      finduser(logintoken);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  
    const fetchPost = async () => {
      try {
        toast.info("Fetching post...", { autoClose: 1000 });

        const { data } = await axios.post("/api/algorithm-details/algorithm-details-find", { slug });
        setPost(data.post);
        toast.success("Post loaded successfully!");
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Failed to load post. Please try again!");
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    
    const fetchProblems = async () => {
      try {
        const { data } = await axios.post("/api/algorithm-details/algorithm-question", { slug });

        const checkedState: Record<string, boolean> = {};
        data.questions.forEach((problem: ProblemData) => {
          checkedState[problem._id] = problem.ischeack.some((check) => check.user === userId);
        });

        setCheckedProblems(checkedState);
        //console.log(data.questions)
        setProblems(data.questions);
      } catch (error) {
        console.error("Error fetching problems:", error);
        toast.error("Failed to load problems. Please try again!");
        setProblems(null);
      }
    };
   
    
    fetchPost();
    fetchProblems();
    finduserdata();
  }, [slug, userId]);
  const finduserdata = async () => {
    try {
      const response = await axios.post("/api/questions/topic-wise-count", { slug, userId });
      setcount(response.data)
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong. Please try again.");
    }
  };
  const finduser = async (accessToken: string) => {
    try {
      const response = await axios.post("/api/client/finduser", { accessToken });
      //console.log(response.data.user); 
      if (response.data.success) {
        setuser(response.data.user?.username); 
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

  const handleCheckboxChange = async (problemId: string) => {
    if (!isLoggedIn) {
      toast.error("Please log in first!");
      return;
    }
    const newCheckedState = !checkedProblems[problemId];

    setCheckedProblems((prev) => ({
      ...prev,
      [problemId]: newCheckedState,
    }));

    try {
      if (newCheckedState) {
        await axios.post("/api/algorithm-details/addcheck", { userId, problemId });
      } else {
        await axios.post("/api/algorithm-details/removecheck", { userId, problemId });
      }
      await finduserdata();
    } catch (error) {
      console.error("Error updating problem check state", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!post) {
    notFound();
  }

  
  const progressData = [
    {
      id: 1,
      value: count?.total 
        ? parseFloat(((count.solve / count.total) * 100).toFixed(1)) 
        : 0, 
      label: "Total Progress",
      link: "#",
    }
  ];
  
  return (
    <div className="min-h-screen bg-white container-fluid mb-[30px] md:mb-[50px]">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="container mx-auto px-4 pt-[100px]">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold">{post.topicname}</h1>
          <div dangerouslySetInnerHTML={{ __html: post.details }} />
          <div className="grid grid-cols-12 gap-6">
          
          <div className="col-span-12  lg:col-span-8">
          <h1 className="text-xl md:text-3xl lg:text-4xl">
            Frequently Asked Questions (FAQs) on {post.topicname}
          </h1>
          {post.freqquestion.map((question, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold">Q{index + 1}: {question.question}</h3>
              <p><b>Answer:</b> {question.answer}</p>
            </div>
          ))}
          </div>
          <div className="col-span-12 lg:col-span-4">
          <ProgressTracker
  progressData={progressData}
  slug={post.topicname}
  solve={count?.solve || 0}
  total={count?.total || 0}
/>

          </div>
          </div>
        </article>

        {/* Interview Questions Table */}
        <div className="mb-[30px]">
          <div className="overflow-x-auto bg-white shadow-xl pt-4">
            <table className="min-w-full border-collapse text-black">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-center">Practice</th>
                  <th className="p-4 text-center">Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {problems?.map((problem, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-4 flex items-center">
                      <input
                        type="checkbox"
                        className="w-5 h-5"
                        checked={checkedProblems[problem._id] || false}
                        onChange={() => handleCheckboxChange(problem._id)}
                      />
                    </td>
                    <td className="p-4 max-w-[200px] whitespace-normal break-words">
                      {problem.problemtitle}
                    </td>
                    <td className="p-4 flex justify-center">
                      <a href={problem.leetcodeLink} target="_blank" rel="noopener noreferrer">
                        
                        <SiLeetcode />
                      </a>
                    </td>
                    <td
                      className={`p-4 text-center ${
                        problem.difficulty === "Easy"
                          ? "bg-green-100 text-green-600"
                          : problem.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {problem.difficulty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Discussion Forum */}
        <DiscussionForum initialPostId={slug} limitcomment={5} />
      </div>
    </div>
  );
}
