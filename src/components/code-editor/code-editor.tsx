"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import MonacoEditor from "./code-display"
import {
  Lightbulb,
  Code2,
  FileText,
  AlertCircle,
  HelpCircle,
  Sparkles,
  X,
} from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"
import { LANGUAGES, type Language } from "./types"

interface CodeEditorProps {
  language: Language
}

const MAX_QUESTION_LENGTH = 4000

export default function CodeEditor({ language }: CodeEditorProps) {
  const meta = LANGUAGES[language]
  const [question, setQuestion] = useState("")
  const [activeTab, setActiveTab] = useState("code")
  const [hints, setHints] = useState("")
  const [code, setCode] = useState("")
  const [explanation, setExplanation] = useState("")
  const [error, setError] = useState("")

  const isMobile = useMobile()

  const [isLoading, setIsLoading] = useState({
    hints: false,
    code: false,
    explanation: false,
  })

  const handleShowHints = async () => {
    if (!question.trim()) return
    setIsLoading((p) => ({ ...p, hints: true }))
    setActiveTab("hints")
    setError("")
    try {
      const response = await fetch("/api/code-editor/hints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to generate hints")
      setHints(data.hints)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate hints")
    } finally {
      setIsLoading((p) => ({ ...p, hints: false }))
    }
  }

  const handleWriteCode = async () => {
    if (!question.trim()) return
    setIsLoading((p) => ({ ...p, code: true }))
    setActiveTab("code")
    setError("")
    try {
      const response = await fetch("/api/code-editor/code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, language }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to generate code")
      setCode(data.code)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate code")
    } finally {
      setIsLoading((p) => ({ ...p, code: false }))
    }
  }

  const handleExplainCode = async () => {
    if (!code) return
    setIsLoading((p) => ({ ...p, explanation: true }))
    setActiveTab("explanation")
    setError("")
    try {
      const response = await fetch("/api/code-editor/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to generate explanation")
      setExplanation(data.explanation)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate explanation")
    } finally {
      setIsLoading((p) => ({ ...p, explanation: false }))
    }
  }

  const tabMeta = [
    { value: "question", label: "Question", icon: HelpCircle },
    { value: "hints", label: "Hints", icon: Lightbulb },
    { value: "code", label: "Code", icon: Code2 },
    { value: "explanation", label: "Explanation", icon: FileText },
  ]

  const renderInputPanel = () => (
    <Card
      className="p-4 sm:p-5 w-full flex flex-col mb-4 border-slate-200 bg-white shadow-sm"
      style={{ height: "310px" }}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <h2 className="text-base sm:text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Sparkles className="h-4 w-4" style={{ color: meta.color }} />
          Ask the AI
        </h2>
        {question && (
          <button
            onClick={() => setQuestion("")}
            className="text-slate-300 hover:text-slate-600 transition-colors"
            title="Clear question"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Textarea
        placeholder="Paste a coding question here… e.g. “Write a function to find the factorial of a number”"
        className="flex-1 resize-none mb-3 font-mono text-sm bg-slate-50 border-slate-200 text-slate-700 placeholder:text-slate-400 focus-visible:ring-1"
        value={question}
        maxLength={MAX_QUESTION_LENGTH}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleShowHints}
            disabled={!question.trim() || isLoading.hints}
            className="flex items-center gap-1.5 text-xs sm:text-sm text-white"
            style={{ backgroundColor: meta.color }}
            size={isMobile ? "sm" : "default"}
          >
            <Lightbulb className="h-3.5 w-3.5" />
            {isLoading.hints ? "Generating…" : "Show hints"}
          </Button>
          <Button
            onClick={handleWriteCode}
            disabled={!question.trim() || isLoading.code}
            variant="secondary"
            className="flex items-center gap-1.5 text-xs sm:text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            size={isMobile ? "sm" : "default"}
          >
            <Code2 className="h-3.5 w-3.5" />
            {isLoading.code ? "Writing…" : "Write code"}
          </Button>
          <Button
            onClick={handleExplainCode}
            disabled={!code || isLoading.explanation}
            variant="outline"
            className="flex items-center gap-1.5 text-xs sm:text-sm border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            size={isMobile ? "sm" : "default"}
          >
            <FileText className="h-3.5 w-3.5" />
            {isLoading.explanation ? "Explaining…" : "Explain code"}
          </Button>
        </div>
        <span className="hidden sm:block text-[11px] text-slate-300 font-mono shrink-0">
          {question.length}/{MAX_QUESTION_LENGTH}
        </span>
      </div>
    </Card>
  )

  const EmptyState = ({ text, icon: Icon }: { text: string; icon: React.ElementType }) => (
    <div className="text-center h-full flex flex-col items-center justify-center gap-2 text-slate-300">
      <Icon className="h-6 w-6" />
      <span className="text-xs sm:text-sm max-w-[220px]">{text}</span>
    </div>
  )

  const Spinner = ({ label }: { label: string }) => (
    <div className="h-full flex items-center justify-center gap-2.5 text-slate-500">
      <div
        className="animate-spin rounded-full h-5 w-5 border-2 border-slate-200"
        style={{ borderTopColor: meta.color }}
      />
      <span className="text-xs sm:text-sm">{label}</span>
    </div>
  )

  const renderOutputPanel = () => (
    <Card
      className="p-3 sm:p-4 w-full flex flex-col border-slate-200 bg-white shadow-sm"
      style={{ minHeight: "500px" }}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mb-3 sm:mb-4 overflow-x-auto flex-nowrap justify-start bg-slate-50 border border-slate-200 p-1 h-auto">
          {tabMeta.map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className={cn(
                "text-xs sm:text-sm gap-1.5 text-slate-500 whitespace-nowrap",
                "data-[state=active]:shadow-none"
              )}
              style={
                activeTab === value
                  ? { backgroundColor: meta.colorSoft, color: meta.color }
                  : undefined
              }
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {error && (
          <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-600">
            <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="text-xs sm:text-sm">{error}</span>
          </div>
        )}

        <TabsContent value="question" className="flex-1 overflow-auto">
          {question ? (
            <pre className="whitespace-pre-wrap bg-slate-50 p-3 sm:p-4 rounded-lg text-slate-700 text-xs sm:text-sm font-mono border border-slate-100">
              {question}
            </pre>
          ) : (
            <EmptyState text="Enter a coding question above to get started." icon={HelpCircle} />
          )}
        </TabsContent>

        <TabsContent value="hints" className="flex-1 overflow-auto">
          {isLoading.hints ? (
            <Spinner label="Generating hints…" />
          ) : hints ? (
            <div className="prose prose-slate prose-sm max-w-none bg-slate-50 p-3 sm:p-4 rounded-lg border border-slate-100">
              <ReactMarkdown>{hints}</ReactMarkdown>
            </div>
          ) : (
            <EmptyState text={'Click "Show hints" for AI-powered nudges in the right direction.'} icon={Lightbulb} />
          )}
        </TabsContent>

        <TabsContent value="code" className="flex-1 overflow-auto">
          <MonacoEditor language={language} initialCode={code} onCodeChange={setCode} />
        </TabsContent>

        <TabsContent value="explanation" className="flex-1 overflow-auto">
          {isLoading.explanation ? (
            <Spinner label="Generating explanation…" />
          ) : explanation ? (
            <div className="prose prose-slate prose-sm max-w-none bg-slate-50 p-3 sm:p-4 rounded-lg border border-slate-100">
              <ReactMarkdown>{explanation}</ReactMarkdown>
            </div>
          ) : (
            <EmptyState text={'Click "Explain code" for a plain-language walkthrough.'} icon={FileText} />
          )}
        </TabsContent>
      </Tabs>
    </Card>
  )

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col gap-3 sm:gap-6">
        {renderInputPanel()}
        {renderOutputPanel()}
      </div>
    </div>
  )
}