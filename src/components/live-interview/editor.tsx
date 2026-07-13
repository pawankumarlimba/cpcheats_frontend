"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import type { editor } from "monaco-editor"
import Editor from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { Play, Code2, RotateCcw, Copy, Download, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type io from "socket.io-client"

interface EditorProps {
  socketRef: React.MutableRefObject<ReturnType<typeof io> | null>
  roomId: string
  onCodeChange: (code: string) => void
}

export type Language = "Javascript" | "Python" | "Java" | "Cpp" | "Ruby" | "C"

const languageIcons: Record<Language, React.ReactNode> = {
  Javascript: <span className="text-yellow-400">JS</span>,
  Python: <span className="text-blue-400">Py</span>,
  Java: <span className="text-orange-400">Ja</span>,
  Cpp: <span className="text-blue-500">C++</span>,
  Ruby: <span className="text-red-500">Rb</span>,
  C: <span className="text-blue-300">C</span>,
}

const CodeEditor: React.FC<EditorProps> = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const [language, setLanguage] = useState<Language>("Javascript")
  const [code, setCode] = useState<string>("// Start coding...")
  const [output, setOutput] = useState<string>("")
  const [error, setError] = useState<string>("")
  const isRemoteChange = useRef<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<string>("editor")
 

  // Handle editor mount
  const handleEditorDidMount = (editorInstance: editor.IStandaloneCodeEditor) => {
    editorRef.current = editorInstance

    editorInstance.onDidChangeModelContent(() => {
      if (isRemoteChange.current) {
        isRemoteChange.current = false
        return
      }

      const newCode = editorInstance.getValue()
      if (newCode !== code) {
        setCode(newCode)
        onCodeChange(newCode)

        if (socketRef.current) {
          socketRef.current.emit("change", { roomId, code: newCode })
        }
      }
    })
  }

  // Listen for socket events
  useEffect(() => {
    if (!socketRef.current) return

    console.log("WebSocket connected:", socketRef.current.connected)

    const handleCodeChange = ({ code: incomingCode }: { code: string }) => {
      console.log("Received code change from remote:", incomingCode)
      if (editorRef.current && incomingCode !== editorRef.current.getValue()) {
        const position = editorRef.current.getPosition()
        isRemoteChange.current = true
        editorRef.current.setValue(incomingCode)
        setCode(incomingCode)
        if (position) {
          editorRef.current.setPosition(position)
          editorRef.current.focus()
        }
      }
    }

    const handleRunEvent = () => {
      console.log("Received run event for room:", roomId)
      runCode()
    }

   

    socketRef.current.on("change", handleCodeChange)
    socketRef.current.on("run", handleRunEvent)
  

    return () => {
      socketRef.current?.off("change", handleCodeChange)
      socketRef.current?.off("run", handleRunEvent)

    }
  }, [socketRef.current, roomId])

  // Retrieve code from localStorage when the component mounts
  useEffect(() => {
    const savedCode = localStorage.getItem(`code-${roomId}`)
    if (savedCode) {
      setCode(savedCode)
      if (editorRef.current) {
        editorRef.current.setValue(savedCode)
      }
    }
  }, [roomId])

  // Save code to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`code-${roomId}`, code)
  }, [code, roomId])

  const runCode = async () => {
    setLoading(true)
    setOutput("")
    setError("")
    setActiveTab("output")

    try {
      const languageMap: Record<Language, number> = {
        Javascript: 63,
        Python: 71,
        Java: 62,
        Cpp: 54,
        Ruby: 72,
        C: 50,
      }

      const languageId = languageMap[language]
      if (!languageId) {
        setError("Unsupported language")
        return
      }

      console.log("Executing code:", code)

      const response = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key": "97e3ff4dc8msha7adbc40207f750p14fb0bjsn9d1488b230c9",
        },
        body: JSON.stringify({
          language_id: languageId,
          source_code: code,
        }),
      })

      const data = await response.json()

      if (data.stdout) {
        setOutput(data.stdout)
      } else if (data.stderr) {
        setError(data.stderr)
      } else if (data.compile_output) {
        setError(data.compile_output)
      } else {
        setError("No output or error")
      }
    } catch (err) {
      setError("Error executing code.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRunButtonClick = () => {
    console.log("Run button clicked for room:", roomId)
    if (socketRef.current) {
      socketRef.current.emit("run", { roomId })
    }
    runCode()
  }

  const copyToClipboard = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue()
      navigator.clipboard.writeText(code)
    }
  }

  const downloadCode = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue()
      const fileExtensions: Record<Language, string> = {
        Javascript: "js",
        Python: "py",
        Java: "java",
        Cpp: "cpp",
        Ruby: "rb",
        C: "c",
      }

      const blob = new Blob([code], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `code.${fileExtensions[language]}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const resetCode = () => {
    const defaultCode = "// Start coding..."
    setCode(defaultCode)
    if (editorRef.current) {
      editorRef.current.setValue(defaultCode)
    }
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg shadow-lg bg-gray-950 text-white overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center space-x-3">
          <Code2 className="h-5 w-5 text-blue-400" />
          <h2 className="hidden sm:flex font-semibold">Collaborative Code Editor</h2>
        </div>

        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                  <SelectTrigger className="w-[140px] bg-gray-800 border-gray-700 focus:ring-blue-500">
                    <SelectValue placeholder="Select Language">
                      <div className="flex items-center gap-2">
                        {languageIcons[language]}
                        {language}
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Javascript" className="focus:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400">JS</span>
                        JavaScript
                      </div>
                    </SelectItem>
                    <SelectItem value="Python" className="focus:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-400">Py</span>
                        Python
                      </div>
                    </SelectItem>
                    <SelectItem value="Java" className="focus:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-orange-400">Ja</span>
                        Java
                      </div>
                    </SelectItem>
                    <SelectItem value="Cpp" className="focus:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-500">C++</span>
                        C++
                      </div>
                    </SelectItem>
                    <SelectItem value="Ruby" className="focus:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-red-500">Rb</span>
                        Ruby
                      </div>
                    </SelectItem>
                    <SelectItem value="C" className="focus:bg-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-300">C</span>C
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TooltipTrigger>
              <TooltipContent>
                <p>Select programming language</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="flex items-center justify-between px-3 py-1 bg-gray-800 border-b border-gray-700">
            <TabsList className="bg-gray-700/50">
              <TabsTrigger value="editor" className="data-[state=active]:bg-blue-600">
                Editor
              </TabsTrigger>
              <TabsTrigger value="output" className="data-[state=active]:bg-blue-600">
                Output {loading && <Loader2 className="ml-2 h-3 w-3 animate-spin" />}
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyToClipboard}
                      className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy code</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={downloadCode}
                      className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download code</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={resetCode}
                      className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reset code</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                      <Button variant="ghost"
                      size="icon"
                       onClick={handleRunButtonClick} 
                       disabled={loading} 
                       className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700">
                      {loading ? (
                    <>
                   <Loader2 className="h-8 w-8 animate-spin" />
             
                   </>
                   ) : (
                  <>
                <Play className="h-8 w-8" />
             
               </>
                )}
               </Button>
                   
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Run code</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <TabsContent value="editor" className="flex-1 p-0 m-0">
            <div className="h-full">
              <Editor
                height="100%"
                language={language.toLowerCase()}
                theme="vs-dark"
                defaultValue={code}
                onMount={handleEditorDidMount}
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  lineNumbers: "on",
                  wordWrap: "on",
                  tabSize: 2,
                  cursorBlinking: "smooth",
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="output" className="flex-1 p-0 m-0 bg-gray-900">
            <div className="h-full overflow-auto p-4 font-mono text-sm">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                  <span className="ml-2 text-blue-400">Running code...</span>
                </div>
              ) : error ? (
                <div className="text-red-400 whitespace-pre-wrap">{error}</div>
              ) : output ? (
                <div className="text-green-400 whitespace-pre-wrap">{output}</div>
              ) : (
                <div className="text-gray-500 flex items-center justify-center h-full">
                  <p>Run your code to see output here</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default CodeEditor

