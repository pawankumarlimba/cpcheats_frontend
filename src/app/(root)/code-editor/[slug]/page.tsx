"use client"
import React, { useState, useEffect } from "react"
import CodeEditor from "@/components/code-editor/code-editor"
import { LANGUAGES, type Language } from "@/components/code-editor/types"

interface Params {
  slug: Language
}

export default function Code({ params }: { params: Promise<Params> }) {
  const { slug } = React.use(params)
  const meta = LANGUAGES[slug]
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 350)
    return () => clearTimeout(timer)
  }, [slug])

  return (
    <div className="min-h-screen bg-white">
      <div className="container-fluid py-8 pt-[100px] px-4 sm:px-6">
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <span
            className="text-[11px] font-medium uppercase tracking-wider mb-2 px-2.5 py-1 rounded-full"
            style={{ backgroundColor: meta.colorSoft, color: meta.color }}
          >
            {meta.label}
          </span>
          <h1 className="text-xl md:text-3xl font-semibold text-slate-800">
            Advanced AI Code Editor
          </h1>
          <p className="text-sm text-slate-400 mt-1.5 max-w-md">
            Write, run, and debug {meta.label} — or describe a problem and let
            the AI draft it for you.
          </p>
        </div>

        {loading ? (
          <div className="max-w-6xl mx-auto flex flex-col gap-4 sm:gap-6 animate-pulse">
            <div className="h-[310px] rounded-xl bg-slate-100" />
            <div className="h-[500px] rounded-xl bg-slate-100" />
          </div>
        ) : (
          <CodeEditor language={slug} />
        )}
      </div>
    </div>
  )
}