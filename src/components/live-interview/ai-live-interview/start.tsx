"use client"

import React from "react"

import { Lightbulb, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Question {
  question: string
}

interface QuestionsSectionProps {
  mockInterviewQuestion: Question[] | null
  activeQuestionIndex: number
  setActiveQuestionIndex?: (index: number) => void
}

const QuestionsSection: React.FC<QuestionsSectionProps> = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  setActiveQuestionIndex = () => {},
}) => {
  const [isSpeaking, setIsSpeaking] = React.useState(false)

  const textToSpeech = (text: string) => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      setIsSpeaking(true)
      const speech = new SpeechSynthesisUtterance(text)

      speech.onend = () => {
        setIsSpeaking(false)
      }

      speech.onerror = () => {
        setIsSpeaking(false)
      }

      window.speechSynthesis.speak(speech)
    } else {
      alert("Sorry, your browser does not support text to speech")
    }
  }

  if (!mockInterviewQuestion || mockInterviewQuestion.length === 0) {
    return (
      <Card className="w-full shadow-sm">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No interview questions available</p>
        </CardContent>
      </Card>
    )
  }

  

  return (
    <Card className="w-full shadow-sm border-muted">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Interview Questions</h3>
          <Badge variant="outline" className="ml-2">
            Question {activeQuestionIndex + 1} of {mockInterviewQuestion.length}
          </Badge>
          </div>
          <div className="w-full bg-muted h-1 mt-4  rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300 ease-in-out"
              style={{
                width: `${((activeQuestionIndex + 1) / mockInterviewQuestion.length) * 100}%`,
              }}
            />
          </div>
        
        <div className="flex flex-wrap w-full gap-4 mt-[20px] pt-4 overflow-x-auto ">
          {mockInterviewQuestion.map((_, index) => (
            <Badge
              key={index}
              variant={activeQuestionIndex === index ? "default" : "outline"}
              className={`cursor-pointer transition-colors ${
                activeQuestionIndex === index ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
              }`}
              onClick={() => setActiveQuestionIndex(index)}
            >
              {index + 1}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="rounded-lg p-6 bg-card border">
          <div className=" justify-between items-start mb-4">
            <h2 className="text-lg md:text-xl font-medium leading-relaxed text-justify">
              {mockInterviewQuestion[activeQuestionIndex]?.question}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0  mt-4"
              onClick={() => {
                const text = mockInterviewQuestion[activeQuestionIndex]?.question
                textToSpeech(text)
              }}
              disabled={isSpeaking}
              title={isSpeaking ? "Speaking..." : "Listen to question"}
            >
              <Volume2 className={`h-10 w-10 ${isSpeaking ? "animate-pulse text-primary" : ""}`} />
              <span className="sr-only">{isSpeaking ? "Speaking..." : "Listen to question"}</span>
            </Button>
          </div>
        </div>

        <div className="rounded-lg p-5 bg-muted/50 mt-6 border">
          <div className="flex gap-2 items-center text-primary mb-2">
            <Lightbulb className="h-5 w-5" />
            <strong className="text-sm">Note:</strong>
          </div>
          <p className="text-sm text-muted-foreground">
            {process.env.NEXT_PUBLIC_QUESTION_NOTE ||
              "Prepare your answer carefully. Focus on structure, clarity, and relevant examples."}
          </p>
        </div>
      </CardContent>

     
    </Card>
  )
}

export default QuestionsSection

