"use client"

import { useEffect, useState } from "react";
import { CheckCircle2, ChevronDown, ChevronUp, Circle} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { ProgressBar } from "../progress-bar/progress-bar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getCookie } from "@/lib/cookies";

interface Step {
  steps: number;
  id: string;
  title: string;
  completed: number;
  total: number;
  quetion: ProblemData[];
  isOpen: boolean;
}

interface ProblemData {
  _id: string;
  problemtitle: string;
  difficulty: "Easy" | "Medium" | "Hard";
  sheets: { name: string };
  ischeack: { user: string }[];
  leetcodeLink: string;
}

interface data2 {
  total: number;
  solve: number;
}
interface LearningProgressProps {
  slug: string;
}

export default function LearningProgress({ slug }: LearningProgressProps) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [checkedProblems, setCheckedProblems] = useState<Record<string, boolean>>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setuser] = useState<string | undefined>();
  const [countdata, setcountdata] = useState<data2 | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const staticSteps: Step[] = [
    { steps: 1, id: "sorting", title: "Sorting", completed: 0, quetion: [], total: 0, isOpen: false },
   { steps: 2, id: "arrays", title: "Solve Problems on Arrays [Easy -> Medium -> Hard]", completed: 0, quetion: [], total: 0, isOpen: false },
   { steps: 3, id: "string", title: "Strings", completed: 0, quetion: [], total: 0, isOpen: false },
   { steps: 4, id: "binarySearch", title: "Binary Search", completed: 0, quetion: [], total: 0, isOpen: false },
  { steps: 5, id: "recursion", title: "Recursion", completed: 0, quetion: [], total: 0, isOpen: false },
   { steps: 6, id: "bitManipulation", title: "Bit Manipulation", completed: 0, quetion: [], total: 0, isOpen: false },
   { steps: 7, id: "linkedList", title: "Learn LinkedList [Single LL, Double LL, Medium, Hard Problems]", completed: 0, quetion: [], total: 0, isOpen: false },
   { steps: 8, id: "stack", title: "Stack", completed: 0, quetion: [], total: 0, isOpen: false },
   { steps: 9, id: "queue", title: "Queue", completed: 0, quetion: [], total: 0, isOpen: false },
   { steps: 10, id: "slidingWindow", title: "Sliding Window", completed: 0, quetion: [], total: 0, isOpen: false },
   { steps: 11, id: "twoPointer", title: "Two Pointer", completed: 0, quetion: [], total: 0, isOpen: false },
   { steps: 12, id: "heap", title: "Heaps", completed: 0, quetion: [], total: 0, isOpen: false },
   { steps: 13, id: "binaryTree", title: "Binary Tree", completed: 0, quetion: [], total: 0, isOpen: false },
   { steps: 14, id: "binarySearchTree", title: "Binary Search Tree", completed: 0, quetion: [], total: 0, isOpen: false },
   { steps: 15, id: "graph", title: "Graph", completed: 0, quetion: [], total: 0, isOpen: false },
   { steps: 16, id: "dynamicProgramming", title: "Dynamic Programing", completed: 0, quetion: [], total: 0, isOpen: false },
   { steps: 17, id: "greedy", title: "Greedy", completed: 0, quetion: [], total: 0, isOpen: false },
  ];

  useEffect(() => {
    const logintoken = getCookie("token1");
    if (logintoken) {
      finduser(logintoken);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchProblems = async () => {
      try {
        const { data } = await axios.post("/api/questions/sheet-wise", { slug, userId });
console.log(data);
        const checkedState: Record<string, boolean> = {};
        const updatedSteps = staticSteps.map((step) => {
          const matchingProblems = data[step.id] || [];
          matchingProblems.forEach((problem: ProblemData) => {
            checkedState[problem._id] = problem.ischeack.some(
              (check) => check.user === userId
            );
          });

          return {
            ...step,
            quetion: matchingProblems,
          };
        });

        setCheckedProblems(checkedState);
        setSteps(updatedSteps);

        finduserdata(updatedSteps);
      } catch (error) {
        console.error("Error fetching problems:", error);
        toast.error("Failed to load problems. Please try again!");
      }
    };

    fetchProblems();
  }, [slug, userId]);

  const finduserdata = async (updatedSteps: Step[]) => {
    try {
      const response = await axios.post("/api/questions/sheet-wise-count", { slug, userId });
    console.log(response,"count tootal data api ")
      const finalSteps = updatedSteps.map((step) => {
        const stepData = response.data[step.id] || {};
        const count = stepData.solve || 0;
        const total = stepData.total || step.total;
        console.log(count,total,"here is total")
        return {
          ...step,
          completed: count,
          total: total,
        };
      });

      setSteps(finalSteps);
      setcountdata(response.data);
    } catch (error) {
      console.error("Error fetching problems:", error);
      toast.error("Something went wrong. Please try again.");
    }finally {
      setIsLoading(false); // Stop loading once data is fetched
    }
  };

  const finduser = async (accessToken: string) => {
    try {
      const response = await axios.post("/api/client/finduser", { accessToken });
      if (response.data.success) {
        setuser(response.data.user?.username);
      } else {
        toast.error(response.data.error || "An error occurred");
      }
    } catch (error) {
      console.error("Error fetching problems:", error);
      toast.error("Something went wrong. Please try again.");
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
      await finduserdata(steps);
    } catch (error) {
      console.error("Error updating problem check state", error);
    }
  };

  const completionPercentage = countdata?.total
    ? Math.round(((countdata?.solve || 0) / countdata?.total) * 100)
    : 0;

    if(!isLoggedIn){
      return(
       <div className="text-center space-y-4 pt-[100px]">
            <p className="text-lg text-gray-700 mb-4">🔒 Please log in to get question.</p>
            <Link className="pt-4" href={"/login"}>
            <Button
              className="shadow-xl bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99]"
            >
              Log In
            </Button>
            </Link>
          </div>)
    }
    if (isLoading && isLoggedIn) {
      return (
          <div className="container-fluid space-y-6">
          {/* Progress header skeleton */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>

          {/* Topic sections skeletons */}
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-48" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-16" />
                  <ChevronDown className="text-gray-300" />
                </div>
              </div>
              <Skeleton className="h-2 w-full mt-4 rounded-full" />
            </div>
          ))}
        </div>
      );
    }
  return (
    <div className="container-fluid mx-auto p-4 space-y-4">
      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-gray-600">
            Your Progress: {countdata?.solve}/{countdata?.total}
          </div>
          <div className="text-blue-600 font-medium">{completionPercentage}% complete</div>
        </div>
        <ProgressBar 
        value={completionPercentage} 
    />
      </div>

      {steps.map((step) => (
        <div  key={step.id} className="border border-gray-700 rounded-lg overflow-hidden">
        <div
       
          className="flex items-center justify-between p-4 cursor-pointer bg-white "
          onClick={() =>
            setSteps((prevSteps) =>
              prevSteps.map((s) =>
                s.id === step.id ? { ...s, isOpen: !s.isOpen } : s
              )
            )
          }
        >
          <div className="flex flex-col sm:flex-row w-full mr-[30px] gap-4 items-center justify-center">
            <div className="flex w-full">
            <h2 className="text-lg font-medium">{step.title}</h2>
            <div className="gap-4 ml-auto mt-1 text-sm text-gray-400">
              <span>
                ({step.completed} / {step.total})
              </span>
            </div>
            </div>
            <div className="w-full sm:w-[400px] ml-auto">
    <ProgressBar 
        value={step?.total 
            ? Math.round(((step?.completed || 0) / step?.total) * 100) 
            : 0} 
    />

              </div>
          </div>
          {step.isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
  
        {step.isOpen && (
          <div className="bg-gray-850 border-t border-gray-700">
            <ul className="divide-y divide-gray-700">
              {step.quetion?.map((problem, index) => (
                
                <li key={index} className="p-3 w-full flex items-center hover:bg-gray-300 transition-colors">
                  <button onClick={() => handleCheckboxChange(problem._id)} className="p-1 mr-3">
                  {checkedProblems[problem._id] || false? (
                      <CheckCircle2 className="text-green-500" size={20} />
                    ) : (
                      <Circle className="text-gray-500" size={20} />
                    )}
                  </button>
                  <Link  href={problem.leetcodeLink} 
                   target="_blank" 
                   rel="noopener noreferrer"
                  >
                  <span className={cn("flex-1", checkedProblems[problem._id]  && "line-through text-gray-500")}>{problem.problemtitle}</span>
                  </Link>
                  <span
                    className={cn(
                      "px-2 py-1 text-xs rounded ml-auto",
                      problem.difficulty === "Easy" && "bg-green-900 text-green-300",
                      problem.difficulty === "Medium" && "bg-yellow-900 text-yellow-300",
                      problem.difficulty === "Hard" && "bg-red-900 text-red-300",
                    )}
                  >
                    {problem.difficulty}
                  </span>
                 
                </li>
                 
              ))}
            </ul>
          </div>
        )}
      </div>
      ))}
    </div>
  );
}
