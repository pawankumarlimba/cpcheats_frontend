"use client"
import type React from "react"
import { useEffect, useState } from "react"
import axios from "axios"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronsUpDown, Home, Star, CheckCircle2, XCircle, MessageCircle, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, useParams } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Define the type for the feedback item
interface FeedbackItem {
  question: string
  rating: string
  userAns: string
  correctAns: string
  feedback: string
}

const Feedback: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({})

  const router = useRouter()
  const params = useParams<{ slug: string }>() // Get the interviewId from the URL

  // Fetch feedback when the component mounts
  useEffect(() => {
    GetFeedback()
  }, [])

  // Fetch feedback using Axios
  const GetFeedback = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/ai-interview/feedback?interviewId=${params.slug}`)
      if (response.data.success) {
        setFeedbackList(response.data.data)
      } else {
        setError("Failed to fetch feedback")
      }
    } catch (error) {
      console.error("Error fetching feedback:", error)
      setError("An error occurred while fetching feedback.")
    } finally {
      setLoading(false)
    }
  }

  // Toggle collapsible item
  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  // Calculate overall performance score
  const calculateOverallScore = () => {
    if (feedbackList.length === 0) return 0

    const ratingMap: Record<string, number> = {
      Excellent: 100,
      Good: 80,
      Average: 60,
      Poor: 40,
      "Very Poor": 20,
    }

    const totalScore = feedbackList.reduce((acc, item) => {
      return acc + (ratingMap[item.rating] || 50)
    }, 0)

    return Math.round(totalScore / feedbackList.length)
  }

  // Render rating stars based on rating text
  const renderRatingStars = (rating: string) => {

    const stars = [];
  
    for (let i = 0; i < 5; i++) {
      if (i < parseInt(rating)) {
        stars.push(<Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="h-5 w-5 text-gray-300" />);
      }
    }
  
    return (
      <div className="flex items-center gap-1">
        {stars}
      </div>
    );
  };
  // Get color for rating badge
  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "5":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "4":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "3":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "2":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100"
      case "1":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-[100px] container-fluid">
      <div className="min-h-screen">
        {/* Header Section */}
        <div className="mb-10 pt-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-full">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Congratulations!
                </h1>
                <p className="text-gray-600">You &apos; ve completed your interview</p>
              </div>
            </div>
            <Button
              className="shadow-xl bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99] transition-all hover:shadow-blue-200"
              onClick={() => router.replace("/live-interview")}
            >
              <Home className="mr-2 h-4 w-4" /> Go Home
            </Button>
          </div>

          <Separator className="my-6" />
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <h2 className="mt-4 text-lg font-medium text-blue-600">Loading your feedback...</h2>
          </div>
        ) : error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <XCircle className="h-6 w-6 text-red-500" />
                <h2 className="text-lg font-medium text-red-700">{error}</h2>
              </div>
            </CardContent>
          </Card>
        ) : feedbackList.length === 0 ? (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                <h2 className="font-medium text-lg text-green-700">No interview feedback available</h2>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Performance Summary */}
            <Card className="mb-8 overflow-hidden border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-2">
                <CardTitle className="text-xl font-bold text-primary">Interview Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Overall Performance</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold">{calculateOverallScore()}%</span>
                    </div>
                    <Progress value={calculateOverallScore()} className="h-2" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Questions Answered</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{feedbackList.length}</span>
                      <span className="text-gray-500">questions</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <h2 className="text-xl font-bold mb-4">Detailed Feedback</h2>
            <p className="text-sm text-gray-600 mb-6">
              Find below interview questions with correct answers, your answer, and feedback for improvements for your
              next interview.
            </p>

            <div className="space-y-4">
              {feedbackList.map((item, index) => (
                <Collapsible
                  key={index}
                  open={openItems[index]}
                  onOpenChange={() => toggleItem(index)}
                  className="border rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md"
                >
                  <CollapsibleTrigger className="p-4 flex justify-between items-center bg-white w-full text-left">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={`${getRatingColor(item.rating)}`}>
                          {item.rating}
                        </Badge>
                        <div className="flex items-center ml-auto">
                      {renderRatingStars(item.rating)}
                    </div>
                      </div>
                      <h3 className="font-medium text-gray-900 text-justify">{item.question}</h3>
                    </div>
                   <div>
                   <ChevronsUpDown className="h-5 w-5 ml-2 text-gray-500 shrink-0" />
                   </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="p-4 pt-0 bg-white border-t">
                      <div className="grid gap-4 mt-4">
                        <div className="p-4 rounded-lg bg-red-50 border border-red-100">
                          <div className="flex items-start gap-2 mb-1">
                            <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                            <div>
                              <h4 className="font-semibold text-red-700 mb-1">Your Answer</h4>
                              <p className="text-red-900 text-justify">{item.userAns}</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                          <div className="flex items-start gap-2 mb-1">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                            <div>
                              <h4 className="font-semibold text-green-700 mb-1">Correct Answer</h4>
                              <p className="text-green-900 text-justify">{item.correctAns}</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                          <div className="flex items-start gap-2 mb-1">
                            <MessageCircle className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                            <div>
                              <h4 className="font-semibold text-blue-700 mb-1">Feedback</h4>
                              <p className="text-blue-900 text-justify">{item.feedback}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Feedback

