"use client";

import { useState } from "react";
import { Editor, type OnMount } from "@monaco-editor/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Play, Loader } from "lucide-react";
import { DrawerDemo } from "./output";
import * as monaco from "monaco-editor";

export type Language = "Javascript" | "Python" | "Java" | "Cpp" | "Ruby" | "C";

interface MonacoEditorProps {
  language: Language;
}

export default function MonacoEditor({ language }: MonacoEditorProps) {
  const [theme, setTheme] = useState("light");
  const [fontSize, setFontSize] = useState(14);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userInput, setUserInput] = useState(""); // State to store user input

  const toggleTheme = () => {
    setTheme(theme === "light" ? "vs-dark" : "light");
  };

  const changeFontSize = (delta: number) => {
    const newSize = Math.max(8, Math.min(fontSize + delta, 24));
    setFontSize(newSize);
    if (editor) {
      editor.updateOptions({ fontSize: newSize });
    }
  };

  const handleEditorDidMount: OnMount = (editor) => {
    setEditor(editor);
  };

  const runCode = async () => {
    setLoading(true);
    try {
      const languageMap: Record<Language, number> = {
        Javascript: 63,
        Python: 71,
        Java: 62,
        Cpp: 54,
        Ruby: 72,
        C: 50,
      };

      if (!languageMap[language]) {
        setOutput("Unsupported language");
        setLoading(false);
        return;
      }

      // Format the input properly (e.g., replace spaces with newlines if needed)
      const formattedInput = userInput.replace(/\s+/g, "\n"); // Replace spaces with newlines

      const response = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key": "97e3ff4dc8msha7adbc40207f750p14fb0bjsn9d1488b230c9",
          },
          body: JSON.stringify({
            language_id: languageMap[language],
            source_code: code,
            stdin: formattedInput, // Pass formatted input
          }),
        }
      );

      const data = await response.json();

      if (data.stdout || data.stderr) {
        setOutput(data.stdout || data.stderr);
      } else {
        setOutput("No output or error");
      }

      setIsDrawerOpen(true);
    } catch (err) {
      setOutput("Error executing code.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid max-w-[100%] mt-[50px]">
      <Card className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-3xl xl:max-w-5xl mx-auto">
        <CardContent className="p-3 md:p-6">
          <div className="flex justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={() => changeFontSize(-2)}>
                <span className="text-lg">A-</span>
              </Button>
              <Button variant="outline" size="icon" onClick={() => changeFontSize(2)}>
                <span className="text-lg">A+</span>
              </Button>
              <Button variant="outline" size="icon" onClick={toggleTheme}>
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex-1 flex justify-end">
              <Button
                onClick={runCode}
                disabled={loading}
                className="hidden md:flex lg:flex"
              >
                {loading ? (
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                ) : (
                  <Play className="h-4 w-4 md:mr-2" />
                )}
                {loading ? "Running..." : "Run"}
              </Button>

              <Button
                onClick={runCode}
                disabled={loading}
                className="block md:hidden lg:hidden flex items-center justify-center"
                size="icon"
              >
                {loading ? (
                  <Loader className="animate-spin h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Input Field for User Input */}
          

          <div className="grid grid-cols-1 gap-4">
            <div className="w-full min-h-[300px] sm:min-h-[350px] md:min-h-[350px]">
              <Editor
                language={language}
                theme={theme}
                value={code}
                onChange={(value) => setCode(value || "")}
                onMount={handleEditorDidMount}
                options={{
                  fontSize: fontSize,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: true,
                  automaticLayout: true,
                  lineNumbers: "on",
                  glyphMargin: false,
                  folding: false,
                  lineDecorationsWidth: 0,
                  lineNumbersMinChars: 2,
                  renderLineHighlight: "none",
                  overviewRulerLanes: 0,
                  scrollbar: { vertical: "hidden", horizontal: "hidden" },
                  padding: { top: 5, bottom: 5 },
                  hideCursorInOverviewRuler: true,
                  renderWhitespace: "none",
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
                  quickSuggestions: {
                    other: true,
                    comments: false,
                    strings: true,
                  },
                }}
              />
            </div>
          </div>
        </CardContent>
        <div className="mb-4 px-[40px]">
            <textarea
              className="w-full p-2 border rounded"
              placeholder="Enter Dynmic input values (e.g., 10 20 for C++ cin >> a >> b)"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
          </div>
      </Card>

      <DrawerDemo open={isDrawerOpen} setOpen={setIsDrawerOpen} output={output} />
    </div>
  );
}