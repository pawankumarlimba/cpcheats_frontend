'use client';

import React, { useState, useRef, useEffect, } from 'react';
import { Bold, Italic, Heading, Code, List, ListOrdered, Link2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ReactMarkdown from "react-markdown"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type RegisterNowProps = {
  onRegister: (data: {
    name: string;
    companyname: string;
    details: string;
  }) => Promise<void>;
};

const RegisterNow: React.FC<RegisterNowProps> = ({ onRegister }) => {
  const [name, setName] = useState<string>('');
  const [companyname, setCompanyName] = useState<string>('');

  const [details, setDetails] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    
    setLoading(true);
    try {
      await onRegister({ name, companyname, details });
    } catch (error) {
      console.error('Error during registration:', error);
    } finally {
      setLoading(false);
    }
  };

  const [activeTab, setActiveTab] = useState<string>("write")

  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (activeTab === "preview") {
      setDetails((prevcdetails) => prevcdetails + " ")
    }
  }, [activeTab])

  const insertFormat = (format: string, placeholder?: string) => {
    if (!textAreaRef.current) return

    const start = textAreaRef.current.selectionStart
    const end = textAreaRef.current.selectionEnd
    const text = textAreaRef.current.value
    const selectedText = text.substring(start, end)

    const formats: Record<string, (text: string) => string> = {
      bold: (text) => `**${text || placeholder || "bold text"}**`,
      italic: (text) => `*${text || placeholder || "italic text"}*`,
      heading: (text) => `# ${text || placeholder || "Heading"}`,
      code: (text) => `\`${text || placeholder || "code"}\``,
      bulletList: (text) => `\n- ${text || placeholder || "List item"}`,
      numberList: (text) => `\n1. ${text || placeholder || "List item"}`,
      link: (text) => `[${text || placeholder || "link text"}](url)`,
    }

    const formatter = formats[format]
    if (!formatter) return

    const newText = text.substring(0, start) + formatter(selectedText) + text.substring(end)
    setDetails(newText)

    setTimeout(() => {
      textAreaRef.current?.focus()
      const newPosition = start + formatter(selectedText).length
      textAreaRef.current?.setSelectionRange(newPosition, newPosition)
    }, 0)
  }


  

  return (
    <div className="max-h-[430px] md:max-h-[580px]  lg:max-h-[480px] overflow-y-auto">
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Enter your name..."
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          className="text-lg font-medium w-[200px] md:w-[400px] lg:w-[600px]"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-[95%] flex  justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-light text-white ${
              loading ? 'bg-gray-400' : 'bg-black'
            } focus:outline-none focus:ring-2 focus:ring-black focus:border-black`}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      <Input
        placeholder="your company name"
        value={companyname}
        required
        onChange={(e) => setCompanyName(e.target.value)}
        className="mb-4 font-normal"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="write" className="space-y-4">
          <div className="flex items-center gap-1 border rounded-md p-1">
            {["bold", "italic", "heading", "code", "bulletList", "numberList", "link"].map((item) => (
              <Button key={item} variant="ghost" size="sm" onClick={() => insertFormat(item)}>
                {item === "bold" && <Bold className="w-4 h-4" />}
                {item === "italic" && <Italic className="w-4 h-4" />}
                {item === "heading" && <Heading className="w-4 h-4" />}
                {item === "code" && <Code className="w-4 h-4" />}
                {item === "bulletList" && <List className="w-4 h-4" />}
                {item === "numberList" && <ListOrdered className="w-4 h-4" />}
                {item === "link" && <Link2 className="w-4 h-4" />}
              </Button>
            ))}
           
          </div>

          <textarea
            ref={textAreaRef}
            required
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Write your experiance here..."
            className="w-full font-light min-h-[150px] md:min-h-[300px] lg:min-h-[220px] p-4  border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />

        </TabsContent>

        <TabsContent value="preview" className=" h-[350px] md:h-[500px] lg:h-[400px] overflow-y-auto">
          <div className="prose prose-slate max-w-none dark:prose-invert">
            <ReactMarkdown>{details || "*No content yet. Start writing in the Write tab!*"}</ReactMarkdown>
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </div>
  )
};

export default RegisterNow;
