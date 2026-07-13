"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import { BookOpen, Code, Brain, ArrowRight, Lock } from "lucide-react"
import { getCookie } from "@/lib/cookies"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ProgressData {
  sheetName: string
  totalQuestions: number
  completedQuestions: number
  link: string
  icon: React.ReactNode
  description: string
}

interface Data1 {
  neetcodesolve: number
  neetcodetotal: number
  lovebabersolve: number
  lovebabertotal: number
  solve: number
  staiversolve: number
  staivertotal: number
  total: number
}

export default function ProgressCards() {
  const [userId, setUserId] = useState<string>("")
  const [datacount, setDatacount] = useState<Data1 | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  useEffect(() => {
    const logintoken = getCookie("token1")
    if (logintoken) {
      finduser(logintoken)
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const finduserquestiondata = async (userId: string) => {
      try {
        const response = await axios.post("/api/questions/user-solve", { userId })
        if (response.status === 200) {
          setDatacount(response.data)
        } else {
          toast.error(response.data.error || "An error occurred")
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.error || "An error occurred")
        } else {
          toast.error("Something went wrong. Please try again.")
        }
      } finally {
        setIsLoading(false)
      }
    }
    if (userId) finduserquestiondata(userId)
  }, [userId])

  const finduser = async (accessToken: string) => {
    try {
      const response = await axios.post("/api/client/finduser", { accessToken })
      if (response.data.success) {
        setUserId(response.data.user?.username)
      } else {
        toast.error(response.data.error || "An error occurred")
      }
    } catch (error) {
      console.error("Error fetching problems:", error)
      toast.error("Something went wrong. Please try again.")
    }
  }

  const getProgressData = (): ProgressData[] => [
    {
      sheetName: "Striver SDE",
      totalQuestions: datacount?.staivertotal || 0,
      completedQuestions: datacount?.staiversolve || 0,
      link: "/coding-sheets/striver-a2z",
      icon: <BookOpen className="h-6 w-6" />,
      description: "Complete DSA sheet by Striver covering all important topics",
    },
    {
      sheetName: "Love Babbar DSA",
      totalQuestions: datacount?.lovebabertotal || 0,
      completedQuestions: datacount?.lovebabersolve || 0,
      link: "/coding-sheets/love-babbar-dsa",
      icon: <Code className="h-6 w-6" />,
      description: "Comprehensive DSA problems curated by Love Babbar",
    },
    {
      sheetName: "NeetCode 150",
      totalQuestions: datacount?.neetcodetotal || 0,
      completedQuestions: datacount?.neetcodesolve || 0,
      link: "/coding-sheets/neetcode-150",
      icon: <Brain className="h-6 w-6" />,
      description: "Top 150 coding interview questions categorized by patterns",
    },
  ]

  if (isLoading && isLoggedIn) {
    return (
      <div className="container-fluid  pt-[100px]">
        <h2 className="text-2xl font-bold mb-6 text-center">Your Progress Tracker</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="overflow-hidden border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-4 w-full mb-6" />
                <Skeleton className="h-2 w-full rounded-full mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </CardContent>
              <div className="px-6 pb-6">
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const progressData = getProgressData()

  return (
    <div className="container-fluid pt-[100px]">
      <h2 className="text-2xl font-bold mb-2 text-center">Your Progress Tracker</h2>
      <p className="text-muted-foreground text-center mb-8">Track your coding journey across popular DSA sheets</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {progressData.map((data, index) => {
          const completionPercentage = Math.round((data.completedQuestions / data.totalQuestions) * 100)

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Card className="h-full overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10 text-primary">{data.icon}</div>
                      <h3 className="text-lg font-semibold">{data.sheetName}</h3>
                    </div>
                    {isLoggedIn && completionPercentage > 0 && (
                      <Badge variant="outline" className="bg-primary/5">
                        {completionPercentage}%
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-6">{data.description}</p>

                  {isLoggedIn ? (
                    <>
                      <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${completionPercentage}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                        />
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{data.completedQuestions} solved</span>
                        <span className="font-medium">{data.totalQuestions} total</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center p-3 bg-muted/30 rounded-lg mb-2">
                      <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Login to track your progress</span>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <Link href={data.link} className="w-full">
                    <Button
                      variant={hoveredCard === index ? "default" : "outline"}
                      className="w-full group transition-all duration-300 "
                    >
                      <span>View Sheet</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

