"use client"

import React, { useEffect, useState } from "react"
import {
  Activity,
} from "lucide-react"

import { Card, CardContent,CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import { toast } from "react-toastify"
import ProgressTracker from "../progres/progres"
import TopicsCovered from "../topic-covered/topic-covered"
import Link from "next/link"

interface Params {
  slug: string;
}
interface data1{
  neetcodesolve:number;
  neetcodetotal:number;
  lovebabersolve:number;
  lovebabertotal:number;
  solve:number;
  staiversolve:number;
  staivertotal:number;
  total:number;
}
interface data2{
  arrays:number;
            linkedList:number;
            binaryTree:number;
            graph:number;
            recursion:number;
            binarySearch:number;
            hashing:number;
            string:number;
            twoPointer:number;
            binarySearchTree:number;
            dynamicProgramming:number;
            sorting:number;
            stack:number;
            heap:number;
            maths:number;
            greedy:number;
            queue:number;
            bitManipulation:number;
            python:number;
            slidingWindow:number;
}
export default function Dashboard({ params }: { params: Promise<Params> }) {

   const { slug } = React.use(params);
  const [currentTime, setCurrentTime] = useState(new Date())
  const [datacount,setdatacount]=useState<data1 |null>();
  const [datacount1,setdatacount1]=useState<data2 |null>();
  // Simulate data loading




  // Update time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
       finduserquestiondata(slug)
       finduserquestiondata1(slug)
     }, [slug]);
   


    const finduserquestiondata = async (userId: string) => {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/questions/user-solve`, {userId});
        console.log(response); 

        if (response.status==200) {
          setdatacount(response.data);
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

    const finduserquestiondata1 = async (userId: string) => {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/questions/user-data`, {userId});
        //console.log(response); 

        if (response.status==200) {
          setdatacount1(response.data);
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
 

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  
  const progressData = [
    {
      id: 1,
      value: datacount ? parseFloat(((datacount.solve / datacount.total) * 100).toFixed(1)) : 0,
      label: "Total Progress",
      link:"#"
    },
    {
      id: 2,
      value: datacount ? parseFloat(((datacount.staiversolve / datacount.staivertotal) * 100).toFixed(1)) : 0,
      label: "Staiver A2Z",
      link:"/coding-sheets/striver-a2z"
    },
    {
      id: 3,
      value: datacount ? parseFloat(((datacount.lovebabersolve / datacount.lovebabertotal) * 100).toFixed(1)) : 0,
      label: "Love Baber",
      link:"/coding-sheets/love-babbar-dsa"
    },
  ]
  
  const topics = [
    { name: "Arrays", count: datacount1?.arrays ||0 ,link:"/arrays"},
    { name: "Linked List", count: datacount1?.linkedList||0 ,link:"/linked-list"},
    { name: "Binary Tree", count: datacount1?.binarySearchTree||0 ,link:"/binary-tree"},
    { name: "Graph", count: datacount1?.graph||0 ,link:"/graph"},
    { name: "Recursion", count: datacount1?.recursion||0 ,link:"/recursion"},
    { name: "Binary Search", count: datacount1?.binarySearch ||0,link:"/binary-search"},
    { name: "Hashing", count: datacount1?.hashing||0 ,link:"/hashing"},
    { name: "String", count: datacount1?.string ||0,link:"/string"},
    { name: "Two Pointer", count: datacount1?.twoPointer||0,link:"/two-pointer" },
    { name: "Binary Search Tree", count: datacount1?.binarySearchTree||0 ,link:"/binary-search-tree"},
    { name: "Dynamic Programming", count: datacount1?.dynamicProgramming||0 ,link:"/dynamic-programming"},
    { name: "Sorting", count: datacount1?.sorting ||0,link:"/sorting"},
    { name: "Stack", count: datacount1?.stack||0 ,link:"/stack"},
    { name: "Heap", count: datacount1?.heap ||0,link:"/heap"},
    { name: "Maths", count: datacount1?.maths||0,link:"/maths"},
    { name: "Greedy", count: datacount1?.greedy ||0,link:"/greedy"},
    { name: "Queue", count: datacount1?.queue||0 ,link:"/queue"},
    { name: "Bit Manipulation", count: datacount1?.bitManipulation||0,link:"/bit-manipulation" },
    { name: "Python", count: datacount1?.python ||0 ,link:"/python"},
    { name: "Sliding Window", count: datacount1?.slidingWindow||0 ,link:"/sliding-window"},
  ]

  return (
    <div
      className={` container-fluid min-h-screen  text-slate-800 relative overflow-hidden`}
    >
      <div className="container mx-auto p-4 relative z-10 pt-[100px]">

        <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 lg:col-span-4">
            <div className="grid gap-6">
              <Card className="bg-white/80 border-slate-200/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-6 border-b border-slate-200/50">
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1 font-mono">SYSTEM TIME</div>
                      <div className="text-3xl font-mono text-cyan-400 mb-1">{formatTime(currentTime)}</div>
                      <div className="text-sm text-slate-600">{formatDate(currentTime)}</div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                        <div className="text-xs text-slate-500 mb-1">Uptime</div>
                        <div className="text-sm font-mono text-slate-800">14d 06:42:18</div>
                      </div>
                      <div className="bg-slate-800/50 rounded-md p-3 border border-slate-700/50">
                        <div className="text-xs text-slate-500 mb-1">Time Zone</div>
                        <div className="text-sm font-mono text-slate-800">UTC-08:00</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 border-slate-200/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-slate-800 text-base">Sheet Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm text-slate-600">Total Progress</div>
                        <div className="text-xs text-cyan-400">{`${datacount ? ((datacount.solve / datacount.total) * 100).toFixed(1) : 0}%`}</div>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                          style={{ width: datacount ? `${((datacount.solve / datacount.total) * 100).toFixed(1)}%` : "0%" }}

                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm text-slate-600">Love Baber Sheet</div>
                        <div className="text-xs text-purple-400">{`${datacount ? ((datacount.lovebabersolve / datacount.lovebabertotal) * 100).toFixed(1) : 0}%`}</div>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          style={{ width: datacount ? `${((datacount.lovebabersolve / datacount.lovebabertotal) * 100).toFixed(1)}%` : "0%" }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm text-slate-600">Staiver Sheet</div>
                        <div className="text-xs text-blue-400">{`${datacount ? ((datacount.staiversolve / datacount.staivertotal) * 100).toFixed(1) : 0}%`}</div>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                          style={{ width: datacount ? `${((datacount.staiversolve / datacount.staivertotal) * 100).toFixed(1)}%` : "0%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-700/50">
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-slate-600">Priority Level</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
          {/* Main dashboard */}
          <div className="col-span-12  lg:col-span-8">
            <div className="grid gap-6">
              {/* System overview */}
              <Card className="bg-white/80 border-slate-200/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-slate-700/50 pb-3">
                  <div className="flex items-center w-full">
                    <CardTitle className="text-slate-800 flex items-center">
                      <Activity className="mr-2 h-5 w-5 text-cyan-500" />
                      Profile Overview
                    </CardTitle>
                    <Link href={"/compare"}>
                    <CardTitle className="text-slate-800 flex items-center ml-auto">
                      Compare with other users
                    </CardTitle>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                 <ProgressTracker progressData={progressData}/>
           
                </CardContent>
              </Card>
              <TopicsCovered topics={topics}/>

            </div>
          </div>

      
        </div>
      </div>
    </div>
  )
}













