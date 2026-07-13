"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import axios from "axios"
import { Camera, Mic, Send, StopCircle, Clock } from "lucide-react"
import moment from "moment"
import Webcam from "react-webcam"
import type React from "react"
import { useEffect, useState, useRef, useCallback } from "react"
import useSpeechToText, { type ResultType } from "react-hook-speech-to-text"
import { toast } from "react-toastify"
import { chatSession } from "@/lib/GeminiAIModal"
import { getCookie } from "@/lib/cookies"

// Define TypeScript interfaces
interface Question {
  question: string
  answer?: string
}

interface InterviewData {
  mockId: string
}

interface RecordAnswerSectionProps {
  mockInterviewQuestion: Question[]
  activeQuestionIndex: number
  interviewData: InterviewData
}

interface IUser {
  username: string
  name: string
  email: string
  accessToken: string
}

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext
  }
}
const RecordAnswerSection: React.FC<RecordAnswerSectionProps> = ({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) => {
  // State and hooks
  const [userAnswer, setUserAnswer] = useState<string>("")
  const [textAnswer, setTextAnswer] = useState<string>("")
  const [user, setUser] = useState<IUser | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [recordingTime, setRecordingTime] = useState<number>(0)
  const [cameraActive, setCameraActive] = useState<boolean>(false)
  const [audioLevel, setAudioLevel] = useState<number>(0)
  const [answerMode, setAnswerMode] = useState<"voice" | "text">("voice")
  const [autoCutEnabled, setAutoCutEnabled] = useState<boolean>(false)
  const [maxRecordingTime, setMaxRecordingTime] = useState<number>(120) // 2 minutes default
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [autoPauseEnabled, setAutoPauseEnabled] = useState<boolean>(false)
  const [silenceThreshold, setSilenceThreshold] = useState<number>(30) // seconds
  const [lastAudioActivity, setLastAudioActivity] = useState<number>(Date.now())
  const audioContext = useRef<AudioContext | null>(null)
  const analyser = useRef<AnalyserNode | null>(null)
  const microphone = useRef<MediaStreamAudioSourceNode | null>(null)
  const audioDataArray = useRef<Uint8Array | null>(null)
  

  const { error, isRecording, results, startSpeechToText, stopSpeechToText, setResults } = useSpeechToText({
    continuous: false, // Set to false to prevent mobile auto-restarting
    useLegacyResults: false,
     timeout: 10000,    // Optional: set a longer timeout (in ms)
  }) as {
    error: string | null
    isRecording: boolean
    results: ResultType[]
    startSpeechToText: () => void
    stopSpeechToText: () => void
    setResults: (results: ResultType[]) => void
  }

  // Fetch user details from cookies and API
  useEffect(() => {
    const logintoken = getCookie("token1")
    if (logintoken) {
      findUser(logintoken)
    }
  }, [])

  // Timer for recording duration
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1

          // Auto-cut recording if enabled and time exceeds max
          if (autoCutEnabled && newTime >= maxRecordingTime) {
            stopSpeechToText()
            return prev
          }

          return newTime
        })
        // Simulate audio level changes
        setAudioLevel(Math.random() * 100)
      }, 1000)

      timerRef.current = interval
    } else {
      setRecordingTime(0)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRecording, autoCutEnabled, maxRecordingTime])

  // Fetch user details using the access token
  const findUser = async (accessToken: string) => {
    try {
      const response = await axios.post("/api/client/finduser", { accessToken })
      if (response.data.success) {
        setUser(response.data.user)
      } else {
        toast.error(response.data.error || "An error occurred")
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "An error occurred")
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    }
  }

  // Remove consecutive duplicate words and phrases
  const removeConsecutiveDuplicates = (text: string): string => {
    return text.replace(/\b(\w+)\s+\1\b/gi, "$1") // Remove repeated words
  }

  // Update userAnswer with speech-to-text results with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      const transcript = results.map((result) => result.transcript).join(" ")
      const cleanedTranscript = removeConsecutiveDuplicates(transcript)
      setUserAnswer(cleanedTranscript)
    }, 3000) // 3000ms debounce to avoid frequent updates

    return () => clearTimeout(handler)
  }, [results])

 const detectSilence = useCallback(() => {
  if (!analyser.current || !audioDataArray.current || !autoPauseEnabled || !isRecording) return;

  // @ts-expect-error - ArrayBufferLike type mismatch in DOM lib definitions
  analyser.current.getByteFrequencyData(audioDataArray.current);
  const average = audioDataArray.current.reduce((sum, value) => sum + value, 0) / audioDataArray.current.length;

  setAudioLevel(average);

  const now = Date.now();

  if (average > 10) {
    setLastAudioActivity(now);
  } else if (now - lastAudioActivity > silenceThreshold * 1000) {
    console.log("Silence detected for 30 seconds. Stopping recording.");
    stopSpeechToText();
  }
}, [isRecording, autoPauseEnabled, silenceThreshold, lastAudioActivity, stopSpeechToText]);


  const setupAudioProcessing = useCallback(async () => {
    try {
      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext || window.webkitAudioContext)()
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      if (microphone.current) {
        microphone.current.disconnect()
      }

      microphone.current = audioContext.current.createMediaStreamSource(stream)
      analyser.current = audioContext.current.createAnalyser()
      analyser.current.fftSize = 256

      microphone.current.connect(analyser.current)

      const bufferLength = analyser.current.frequencyBinCount
      audioDataArray.current = new Uint8Array(bufferLength)

      // Start silence detection loop
      const checkSilence = () => {
        detectSilence()
        if (isRecording) {
          requestAnimationFrame(checkSilence)
        }
      }

      checkSilence()
    } catch (err) {
      console.error("Error accessing microphone:", err)
    }
  }, [detectSilence, isRecording])

  // Start or stop recording
  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText()
    } else {
      startSpeechToText()
      if (autoPauseEnabled) {
        setLastAudioActivity(Date.now())
        setupAudioProcessing()
      }
    }
  }

  const restartRecording = () => {
    if (isRecording) {
      stopSpeechToText()
    }
    setUserAnswer("")
    setResults([])
    setTimeout(() => {
      startSpeechToText()
      if (autoPauseEnabled) {
        setLastAudioActivity(Date.now())
        setupAudioProcessing()
      }
    }, 300)
  }

  // Toggle camera
  const toggleCamera = () => {
    setCameraActive(!cameraActive)
  }

  // Format recording time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Save user answer and get feedback from AI
  const UpdateUserAnswer = async () => {
    setLoading(true)

    // Use the appropriate answer based on the mode
    const finalAnswer = answerMode === "voice" ? userAnswer : textAnswer

    // Prepare the prompt for AI feedback
    const feedbackPrompt = `
      Question: ${mockInterviewQuestion[activeQuestionIndex]?.question},
      User Answer: ${finalAnswer},
      Based on the question and user answer, please provide:
      1. Analyze the following answer critically and provide a strict rating on a scale of 1 to 10 based on these four factors.
      2. Feedback for improvement in 3 to 5 lines.
      Return the response in JSON format with "rating" and "feedback" fields.
    `

    try {
      // Send the prompt to the AI model
      const result = await chatSession.sendMessage(feedbackPrompt)
      const mockJsonResp = result.response.text().replace("```json", "").replace("```", "")
      const JsonfeedbackResp = JSON.parse(mockJsonResp)

      // Save the user answer and feedback via API
      const response = await axios.post("/api/ai-interview/user-answer/save", {
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: finalAnswer,
        feedback: JsonfeedbackResp?.feedback,
        rating: JsonfeedbackResp?.rating,
        userEmail: user?.email,
        createdAt: moment().format("DD-MM-YYYY"),
      })

      if (response.data.success) {
        toast.success("User Answer recorded successfully")
        setUserAnswer("")
        setTextAnswer("")
        setResults([])
      } else {
        toast.error("Failed to save user answer")
      }
    } catch (error) {
      console.error("Error saving user answer:", error)
      toast.error("Error saving user answer")
    }

    setLoading(false)
  }

  useEffect(() => {
    return () => {
      if (microphone.current) {
        microphone.current.disconnect()
      }
      if (audioContext.current && audioContext.current.state !== "closed") {
        audioContext.current.close()
      }
    }
  }, [])

  // Handle Web Speech API errors
  if (error)
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-destructive">Web Speech API is not available in this browser 🤷‍</p>
          <p className="text-muted-foreground text-sm mt-2">Please try using Chrome, Edge, or Safari.</p>
        </CardContent>
      </Card>
    )

  // Render the component
  return (
    <div className="flex justify-center items-center flex-col w-full max-w-2xl mx-auto">
      <Card className="w-full border-muted">
        <CardContent className="p-0 overflow-hidden">
          {/* Camera section */}
          <div className="relative bg-gradient-to-b from-slate-900 to-slate-800 aspect-video flex justify-center items-center">
            {cameraActive ? (
              <div className="w-full ">
                <div className="relative bg-black aspect-video flex items-center justify-center">
                  <Webcam
                    onUserMedia={() => setCameraActive(true)}
                    onUserMediaError={() => setCameraActive(false)}
                    mirrored={true}
                    className="w-full h-auto"
                  />
                </div>
                {isRecording && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-2 animate-pulse">
                    <span className="h-2 w-2 rounded-full bg-white"></span>
                    REC {formatTime(recordingTime)}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center mb-4">
                  <Camera className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-white text-lg font-medium mb-2">Camera is turned off</h3>
                <p className="text-slate-400 text-sm mb-4">Enable camera for a better interview experience</p>
                <Button
                  variant="outline"
                  className="bg-slate-700 text-white hover:bg-slate-600 border-slate-600"
                  onClick={toggleCamera}
                >
                  Turn on camera
                </Button>
              </div>
            )}
          </div>

          {/* Controls section */}
          <div className="p-6 space-y-4">
            {/* Answer mode tabs */}
            <Tabs defaultValue="voice" onValueChange={(value) => setAnswerMode(value as "voice" | "text")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="voice">Voice Recording</TabsTrigger>
                <TabsTrigger value="text">Text Input</TabsTrigger>
              </TabsList>

              <TabsContent value="voice" className="space-y-4 mt-4">
                {/* Auto-cut settings */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-cut" checked={autoCutEnabled} onCheckedChange={setAutoCutEnabled} />
                      <Label htmlFor="auto-cut" className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Auto-cut recording
                      </Label>
                    </div>

                    {autoCutEnabled && (
                      <div className="flex items-center gap-2">
                        <Label htmlFor="max-time" className="text-sm">
                          Max time:
                        </Label>
                        <select
                          id="max-time"
                          className="text-sm p-1 rounded border"
                          value={maxRecordingTime}
                          onChange={(e) => setMaxRecordingTime(Number(e.target.value))}
                        >
                          <option value="30">30 sec</option>
                          <option value="60">1 min</option>
                          <option value="120">2 min</option>
                          <option value="180">3 min</option>
                          <option value="300">5 min</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-pause" checked={autoPauseEnabled} onCheckedChange={setAutoPauseEnabled} />
                      <Label htmlFor="auto-pause" className="flex items-center gap-1">
                        <Mic className="h-4 w-4" />
                        Auto-pause on silence
                      </Label>
                    </div>

                    {autoPauseEnabled && (
                      <div className="flex items-center gap-2">
                        <Label htmlFor="silence-threshold" className="text-sm">
                          Pause after:
                        </Label>
                        <select
                          id="silence-threshold"
                          className="text-sm p-1 rounded border"
                          value={silenceThreshold}
                          onChange={(e) => setSilenceThreshold(Number(e.target.value))}
                        >
                          <option value="1">1 sec</option>
                          <option value="1.5">1.5 sec</option>
                          <option value="2">2 sec</option>
                          <option value="3">3 sec</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Audio visualization */}
                {isRecording && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Audio Level</span>
                      <span>{formatTime(recordingTime)}</span>
                    </div>
                    <Progress value={audioLevel} className="h-2" />
                  </div>
                )}

                {/* Recording controls */}
                <div className="flex justify-center gap-4">
                  <Button
                    disabled={loading}
                    variant={isRecording ? "destructive" : "default"}
                    size="lg"
                    className={cn("rounded-full h-14 w-14 p-0", isRecording && "animate-pulse")}
                    onClick={StartStopRecording}
                  >
                    {isRecording ? <StopCircle className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                  </Button>

                  {!isRecording && userAnswer.length > 0 && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full h-14 w-14 p-0"
                      onClick={restartRecording}
                      disabled={loading}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-refresh-cw"
                      >
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                        <path d="M21 3v5h-5" />
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                        <path d="M3 21v-5h5" />
                      </svg>
                    </Button>
                  )}

                  {cameraActive && (
                    <Button variant="outline" size="lg" className="rounded-full h-14 w-14 p-0" onClick={toggleCamera}>
                      <Camera className="h-6 w-6" />
                    </Button>
                  )}

                  {userAnswer.length > 0 && !isRecording && (
                    <Button
                      variant="default"
                      size="lg"
                      className="rounded-full h-14 w-14 p-0 bg-green-600 hover:bg-green-700"
                      onClick={UpdateUserAnswer}
                      disabled={loading}
                    >
                      <Send className="h-6 w-6" />
                    </Button>
                  )}
                </div>

                {/* Transcription display */}
                <div className="mt-4 relative min-h-20">
                  {loading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  ) : (
                    <div className="p-4 bg-muted/30 rounded-lg">
                      {userAnswer ? (
                        <p className="text-sm text-slate-700">{userAnswer}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center italic">
                          {isRecording
                            ? "Listening to your answer..."
                            : "Click the microphone button to start recording your answer"}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="text" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="text-answer">Type your answer</Label>
                  <Textarea
                    id="text-answer"
                    placeholder="Enter your answer here..."
                    className="min-h-[150px]"
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="default"
                    onClick={UpdateUserAnswer}
                    disabled={loading || textAnswer.trim().length === 0}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit Answer
                  </Button>
                </div>

                {loading && (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RecordAnswerSection

