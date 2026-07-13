"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Loader2, Send, Database, Sparkles, User, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/card";
import { Textarea } from "../ui/textarea";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "ai";
  content: string;
  problemContext?: string;
}

export default function AITextGenerator() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputHeight, setInputHeight] = useState("h-12");

  // MCP Context States
  const [problems, setProblems] = useState<string[]>([]);
  const [selectedProblem, setSelectedProblem] = useState("");
  const [isFetchingProblems, setIsFetchingProblems] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Explain Dynamic Programming in simple terms",
    "What is the time complexity of QuickSort?",
    "How do I solve the Two Sum problem?",
    "Tell me about the Striver A2Z sheet",
  ];

  // Load problem titles for MCP context mapping
  useEffect(() => {
    const loadProblems = async () => {
      setIsFetchingProblems(true);
      try {
        interface ProbItem {
          problemtitle: string;
        }
        const response = await axios.post("/api/questions/sheet-wise", { slug: "striver-a2z" });
        const titles: string[] = [];
        Object.values(response.data).forEach((probList) => {
          if (Array.isArray(probList)) {
            probList.forEach((p) => {
              const problemItem = p as ProbItem;
              if (problemItem.problemtitle) titles.push(problemItem.problemtitle);
            });
          }
        });
        setProblems(Array.from(new Set(titles)).sort());
      } catch (err) {
        console.error("Failed to load database problem list:", err);
      } finally {
        setIsFetchingProblems(false);
      }
    };
    loadProblems();
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleGenerate = async (messageText?: string) => {
    const textToSend = messageText || prompt;
    if (!textToSend.trim()) return;

    const currentPrompt = textToSend;
    const currentContext = selectedProblem;

    setIsLoading(true);
    setPrompt(""); // Clear input

    // Append user message
    setMessages((prev) => [
      ...prev,
      { role: "user", content: currentPrompt, problemContext: currentContext },
    ]);

    try {
      const { data } = await axios.post("/api/google-api", {
        prompt: currentPrompt,
        problemTitle: currentContext || undefined,
      });

      // Append mentor reply
      setMessages((prev) => [...prev, { role: "ai", content: data.result }]);
    } catch (error) {
      console.error("Error generating mentor response:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "Hey, I encountered an issue pulling up that answer from the database. Let's try re-submitting in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    e.target.style.height = "auto";
    const newHeight = Math.min(e.target.scrollHeight, 150);
    setInputHeight(`h-[${newHeight}px]`);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleGenerate();
  };

  const handleClearChat = () => {
    setMessages([]);
    setSelectedProblem("");
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] w-full max-w-4xl mx-auto px-4 py-3">
      <Card className="flex-1 flex flex-col border border-slate-200 shadow-sm overflow-hidden bg-white rounded-2xl h-[650px]">
        {/* Header Controls */}
        <CardHeader className="border-b border-slate-100 bg-slate-50 px-4 py-3 flex flex-row items-center justify-between flex-wrap gap-2">
          <div className="flex items-center justify-between w-full">
            {/* MCP Context Selection */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs shadow-sm">
              <Database className="h-3.5 w-3.5 text-[#707FDD]" />
              <select
                value={selectedProblem}
                onChange={(e) => setSelectedProblem(e.target.value)}
                disabled={isFetchingProblems}
                className="bg-transparent text-slate-700 focus:outline-none cursor-pointer max-w-[200px] font-semibold"
              >
                <option value="" className="text-slate-400">
                  {isFetchingProblems ? "Loading problems..." : "No Database Context"}
                </option>
                {problems.map((title, idx) => (
                  <option key={idx} value={title} className="text-slate-700">
                    {title}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearChat}
              title="Reset Chat"
              className="h-8 w-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Message Feed Area */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          {messages.length ? (
            messages.map((msg, index) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={index}
                  className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar Icons */}
                  <div
                    className={`p-2 rounded-full shrink-0 ${isUser ? "bg-[#3F66FB]/10 text-[#3F66FB]" : "bg-[#707FDD]/10 text-[#707FDD]"
                      }`}
                  >
                    {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                  </div>

                  <div className={`flex flex-col max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
                    {/* Message Bubble */}
                    <div
                      className={`p-4 rounded-2xl text-sm leading-relaxed ${isUser
                          ? "bg-gradient-to-r from-[#707FDD] to-[#3F66FB] text-white rounded-tr-none shadow-md"
                          : "bg-slate-50 border border-slate-200 text-slate-700 rounded-tl-none"
                        }`}
                    >
                      <div className="markdown-body prose prose-sm max-w-none prose-slate prose-invert:text-white">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>

                    {/* Context Tag details (for users) */}
                    {isUser && msg.problemContext && (
                      <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 justify-end font-medium">
                        <Database className="h-3 w-3 text-[#707FDD]" />
                        Prompted under problem: {msg.problemContext}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <Sparkles className="h-10 w-10 text-[#707FDD]/40 mb-1 animate-pulse" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-700">
                  Ask your mentor anything about DSA coding sheets!
                </p>
                <p className="text-xs text-slate-400 max-w-sm leading-normal">
                  Select a problem context above to search your database comments, difficulty, and
                  references dynamically using MCP.
                </p>
              </div>

              {/* Suggestions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-xl w-full pt-4">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleGenerate(suggestion)}
                    className="text-xs text-left p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-600 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#707FDD]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-full bg-[#707FDD]/10 text-[#707FDD] shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200 text-slate-500 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-[#707FDD]" />
                <span className="text-xs font-medium">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input Form Bar */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <form onSubmit={handleSubmit} className="flex space-x-2 items-center">
            <Textarea
              value={prompt}
              onChange={handleInputChange}
              placeholder={selectedProblem ? `Ask about "${selectedProblem}"...` : "Ask a DSA question..."}
              className={`resize-none flex-1 min-h-[48px] bg-slate-50 border-slate-200 text-slate-700 placeholder-slate-400 rounded-xl focus-visible:ring-[#707FDD] ${inputHeight}`}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !prompt.trim()}
              className="h-11 w-11 rounded-xl bg-gradient-to-r from-[#707FDD] to-[#3F66FB] hover:opacity-90 text-white shrink-0 shadow-md"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}