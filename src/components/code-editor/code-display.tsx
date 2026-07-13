"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Editor, type OnMount } from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import {
  Moon,
  Sun,
  Play,
  Loader,
  Copy,
  Check,
  RotateCcw,
  Terminal,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  CircleCheck,
} from "lucide-react"
import { toast } from "react-toastify"
import type * as monaco from "monaco-editor"
import { cn } from "@/lib/utils"
import { LANGUAGES, DEFAULT_SNIPPETS, type Language } from "./types"

interface MonacoEditorProps {
  language: Language
  initialCode?: string
  onCodeChange?: (code: string) => void
}

interface RunResult {
  stdout: string | null
  stderr: string | null
  compile_output: string | null
  status: { id: number; description: string } | null
  time: string | null
  memory: number | null
}

export default function MonacoEditor({
  language,
  initialCode = "",
  onCodeChange,
}: MonacoEditorProps) {
  const meta = LANGUAGES[language]
  const storageKey = `ce:code:${language}`

  const [theme, setTheme] = useState<"light" | "vs-dark">("light")
  const [fontSize, setFontSize] = useState(14)
  const [code, setCode] = useState(initialCode)
  const [result, setResult] = useState<RunResult | null>(null)
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [userInput, setUserInput] = useState("")
  const [showInput, setShowInput] = useState(false)
  const [consoleOpen, setConsoleOpen] = useState(false)
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 })

  const hasHydrated = useRef(false)

  useEffect(() => {
    if (hasHydrated.current) return
    hasHydrated.current = true

    if (initialCode) {
      setCode(initialCode)
      return
    }
    try {
      const saved =
        typeof window !== "undefined"
          ? window.localStorage.getItem(storageKey)
          : null
      setCode(saved ?? DEFAULT_SNIPPETS[language])
    } catch {
      setCode(DEFAULT_SNIPPETS[language])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (initialCode && initialCode !== code) {
      setCode(initialCode)
      editor?.setValue(initialCode)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode])

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        window.localStorage.setItem(storageKey, code)
      } catch {
        // storage unavailable — fail silently, this is a nice-to-have
      }
    }, 400)
    return () => clearTimeout(id)
  }, [code, storageKey])

  const toggleTheme = () => setTheme((t) => (t === "light" ? "vs-dark" : "light"))

  const changeFontSize = (delta: number) => {
    const newSize = Math.max(10, Math.min(fontSize + delta, 22))
    setFontSize(newSize)
    editor?.updateOptions({ fontSize: newSize })
  }

  const handleEditorDidMount: OnMount = (ed) => {
    setEditor(ed)
    ed.onDidChangeCursorPosition((e) => {
      setCursorPos({ line: e.position.lineNumber, col: e.position.column })
    })
  }

  const handleCodeChange = (value: string | undefined) => {
    const next = value ?? ""
    setCode(next)
    onCodeChange?.(next)
  }

  const handleReset = () => {
    const starter = DEFAULT_SNIPPETS[language]
    setCode(starter)
    editor?.setValue(starter)
    toast.info("Editor reset to the starter snippet.")
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast.success("Code copied to clipboard.")
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error("Couldn't copy to clipboard.")
    }
  }

  const runCode = useCallback(async () => {
    if (loading) return
    setLoading(true)
    setConsoleOpen(true)
    try {
      const formattedInput = userInput.replace(/\s+/g, "\n")

      const response = await fetch("/api/code-editor/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          languageId: meta.judge0Id,
          sourceCode: code,
          stdin: formattedInput,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to run code")
      setResult(data)
    } catch (err) {
      setResult({
        stdout: null,
        stderr: err instanceof Error ? err.message : "Error executing code.",
        compile_output: null,
        status: null,
        time: null,
        memory: null,
      })
    } finally {
      setLoading(false)
    }
  }, [code, userInput, meta.judge0Id, loading])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault()
        runCode()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [runCode])

  const hasError = !!(result?.stderr || result?.compile_output)
  const outputText =
    result?.compile_output || result?.stderr || result?.stdout || ""

  return (
    <div className="w-full rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
      {/* Window chrome / file tab bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            {[0.9, 0.55, 0.3].map((op, i) => (
              <span
                key={i}
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: meta.color, opacity: op }}
              />
            ))}
          </div>
          <div
            className="flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-mono shrink-0"
            style={{ backgroundColor: meta.colorSoft, color: meta.color }}
          >
            solution.{meta.extension}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
            onClick={() => changeFontSize(-1)}
            title="Decrease font size"
          >
            <span className="text-xs font-medium">A-</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
            onClick={() => changeFontSize(1)}
            title="Increase font size"
          >
            <span className="text-xs font-medium">A+</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
            onClick={toggleTheme}
            title={theme === "light" ? "Switch to dark editor theme" : "Switch to light editor theme"}
          >
            {theme === "light" ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
            onClick={copyCode}
            title="Copy code"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
            onClick={handleReset}
            title="Reset to starter snippet"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>

          <Button
            onClick={runCode}
            disabled={loading}
            size="sm"
            className="h-7 gap-1.5 px-3 text-white font-medium"
            style={{ backgroundColor: meta.color }}
          >
            {loading ? (
              <Loader className="animate-spin h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
            {loading ? "Running" : "Run"}
            <kbd className="hidden sm:inline-block ml-1 text-[10px] font-mono opacity-70">
              ⌘⏎
            </kbd>
          </Button>
        </div>
      </div>

      {/* Editor surface */}
      <div className="w-full h-[320px] sm:h-[380px] md:h-[420px]">
        <Editor
          language={meta.monacoId}
          theme={theme}
          value={code}
          onChange={handleCodeChange}
          onMount={handleEditorDidMount}
          options={{
            fontSize,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            lineNumbers: "on",
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 8,
            lineNumbersMinChars: 3,
            renderLineHighlight: "gutter",
            overviewRulerLanes: 0,
            scrollbar: { vertical: "auto", horizontal: "auto" },
            padding: { top: 12, bottom: 12 },
            hideCursorInOverviewRuler: true,
            renderWhitespace: "none",
            cursorBlinking: "smooth",
            smoothScrolling: true,
            suggest: {
              showWords: true,
              showSnippets: true,
              showConstants: true,
              showVariables: true,
              showClasses: true,
              showModules: true,
              showFunctions: true,
              showEvents: true,
              showTypeParameters: true,
            },
            quickSuggestions: { other: true, comments: false, strings: true },
          }}
        />
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-4 py-1.5 text-[11px] font-mono border-t border-b border-slate-100 bg-slate-50 text-slate-400">
        <div className="flex items-center gap-3">
          <span style={{ color: meta.color }}>{meta.label}</span>
          <span>
            Ln {cursorPos.line}, Col {cursorPos.col}
          </span>
        </div>
        <button
          onClick={() => setShowInput((s) => !s)}
          className="hover:text-slate-600 transition-colors"
        >
          {showInput ? "Hide stdin" : "Add stdin"}
        </button>
      </div>

      {showInput && (
        <div className="px-4 py-3 border-b border-slate-100">
          <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
            Program input (stdin)
          </label>
          <textarea
            className="w-full min-h-[64px] p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm font-mono text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#707FDD]/50 focus:border-[#707FDD]/40"
            placeholder="e.g. 10 20 → becomes two lines for cin >> a >> b"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
        </div>
      )}

      {/* Inline console */}
      <div>
        <button
          onClick={() => setConsoleOpen((o) => !o)}
          className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors bg-slate-50"
        >
          <span className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5" />
            Console
            {result && (
              <span
                className="flex items-center gap-1"
                style={{ color: hasError ? "#DC2626" : "#16A34A" }}
              >
                {hasError ? (
                  <CircleAlert className="h-3.5 w-3.5" />
                ) : (
                  <CircleCheck className="h-3.5 w-3.5" />
                )}
              </span>
            )}
            {result?.time && (
              <span className="text-slate-400">
                {result.time}s{result.memory ? ` · ${Math.round(result.memory / 1024)}MB` : ""}
              </span>
            )}
          </span>
          {consoleOpen ? (
            <ChevronDown className="h-3.5 w-3.5" />
          ) : (
            <ChevronUp className="h-3.5 w-3.5" />
          )}
        </button>

        {consoleOpen && (
          <div className="px-4 py-3 max-h-[220px] overflow-auto bg-white border-t border-slate-100">
            {loading ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Loader className="h-3.5 w-3.5 animate-spin" />
                Running your code…
              </div>
            ) : result ? (
              <pre
                className={cn(
                  "text-sm font-mono whitespace-pre-wrap break-words",
                  hasError ? "text-red-600" : "text-slate-700"
                )}
              >
                {outputText || "Program finished with no output."}
              </pre>
            ) : (
              <p className="text-sm text-slate-400">
                Run your code to see the output here.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}