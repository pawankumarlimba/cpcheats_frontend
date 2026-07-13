"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,} from "recharts";

interface Data {
  arrays: number;
  linkedList: number;
  binaryTree: number;
  graph: number;
  recursion: number;
  binarySearch: number;
  hashing: number;
  string: number;
  twoPointer: number;
  binarySearchTree: number;
  dynamicProgramming: number;
  sorting: number;
  stack: number;
  heap: number;
  maths: number;
  greedy: number;
  queue: number;
  bitManipulation: number;
  python: number;
  slidingWindow: number;
}

interface ProgressOverTimeChartProps {
  userId: string;
  friendId: string;
}

export default function ProgressOverTimeChart({ userId, friendId }: ProgressOverTimeChartProps) {
  const [dataCount, setDataCount] = useState<Data | null>(null);
  const [friendDataCount, setFriendDataCount] = useState<Data | null>(null);

  useEffect(() => {
    const fetchUserData = async (id: string, setData: (data: Data) => void) => {
      try {
        const response = await axios.post("/api/questions/user-data", { userId: id });
        if (response.status === 200) {
          setData(response.data);
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

    fetchUserData(userId, setDataCount);
    fetchUserData(friendId, setFriendDataCount);
  }, [userId, friendId]);

  
  const topicData = [
    { topic: "Arrays", yourProblems: dataCount?.arrays || 0, friendProblems: friendDataCount?.arrays || 0 },
    { topic: "Strings", yourProblems: dataCount?.string || 0, friendProblems: friendDataCount?.string || 0 },
    { topic: "Linked Lists", yourProblems: dataCount?.linkedList || 0, friendProblems: friendDataCount?.linkedList || 0 },
    { topic: "Trees", yourProblems: dataCount?.binaryTree || 0, friendProblems: friendDataCount?.binaryTree || 0 },
    { topic: "Graphs", yourProblems: dataCount?.graph || 0, friendProblems: friendDataCount?.graph || 0 },
    { topic: "Dynamic Programming", yourProblems: dataCount?.dynamicProgramming || 0, friendProblems: friendDataCount?.dynamicProgramming || 0 },
    { topic: "Sorting", yourProblems: dataCount?.sorting || 0, friendProblems: friendDataCount?.sorting || 0 },
    { topic: "Greedy Algorithms", yourProblems: dataCount?.greedy || 0, friendProblems: friendDataCount?.greedy || 0 },
    { topic: "Binary Search", yourProblems: dataCount?.binarySearch || 0, friendProblems: friendDataCount?.binarySearch || 0 },
    { topic: "Recursion", yourProblems: dataCount?.recursion || 0, friendProblems: friendDataCount?.recursion || 0 },
  ];

  return (
    <Card >
      <CardHeader>
        <CardTitle>Progress by Topic</CardTitle>
        <CardDescription>Comparison of problems solved by topic</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={topicData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="topic" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="yourProblems"
                name="Your Problems Solved"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <Line
            type="monotone"
            dataKey="friendProblems"
            name={`${friendId} Problems Solved`} 
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
              />

            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
