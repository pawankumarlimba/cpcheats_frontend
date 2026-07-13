'use client';

import React, { useState, useRef, useEffect, } from 'react';
import { Bold, Italic,Code, ListOrdered, Link2, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from 'next/link';

export type RegisterNowProps = {
  onRegister: (data: string) => Promise<void>;
  isloggedin:boolean;
};

const RegisterNow: React.FC<RegisterNowProps> = ({ onRegister,isloggedin }) => {
  const [details, setDetails] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const handleSubmit = async () => {
    if(!isloggedin) return;
    setLoading(true);
    try {
      await onRegister(details);
      setDetails("");
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
    <div className="container-fluid shadow-xl  overflow-y-auto">
    <div className="w-full bg-white  mx-auto p-2 ">
     
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
       

        <TabsContent value="write" className="space-y-4">
        <div className="flex flex-col items-start gap-1 border rounded-md py-1">
          <textarea
            ref={textAreaRef}
            required
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Write your experiance here..."
             className="w-full font-light min-h-[100px] md:min-h-[100px] lg:min-h-[100px] p-4 outline-none"
          />
                  <div className="flex items-center  p-1">
            {["bold", "italic", "link"].map((item) => (
              <Button key={item} variant="ghost" size="sm" onClick={() => insertFormat(item)}>
                {item === "bold" && <Bold className="w-4 h-4" />}
                {item === "italic" && <Italic className="w-4 h-4" />}
                {item === "code" && <Code className="w-4 h-4" />}
                {item === "numberList" && <ListOrdered className="w-4 h-4" />}
                {item === "link" && <Link2 className="w-4 h-4" />}
              </Button>
            ))}
        
           </div>
</div>
        </TabsContent>
      
        <TabsContent value="preview" className=" h-[100px] md:h-[100px] lg:h-[100px] overflow-y-auto">
          <div className="prose prose-slate max-w-none dark:prose-invert">
            <ReactMarkdown>{details || "*No content yet. Start writing in the Write tab!*"}</ReactMarkdown>
          </div>
        </TabsContent>
        <div className="flex  w-full justify-between mt-4">
        
        <div
              onMouseEnter={() => !isloggedin && setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="relative"
            >
              <Button
                onClick={handleSubmit}
                disabled={loading || !isloggedin}
                className={`flex justify-center shadow-xl py-0 px-3 rounded-md  text-sm font-light ${
                  loading ? 'bg-white text-black' : 'bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99] text-white'
                }`}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>

              {!isloggedin && showTooltip && (
                <Link href={"/login"}>
                <div className="absolute left-0 top-0 flex items-center gap-1 px-3 py-2 shadow-sm text-sm font-light  bg-[#F2F2F2] hover:bg-[#F2F2F2] text-[#666666] rounded-md">
                 <Ban size={12}/> Login 
                </div>
                </Link>
              )}
            </div>
          <div className='ml-auto '>
          <TabsList className="mb-4">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        </div>
        
      </div>
      </Tabs>
    </div>
    </div>
  )
};

export default RegisterNow;
