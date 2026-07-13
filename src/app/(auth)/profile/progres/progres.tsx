"use client"

import { useState, useEffect } from "react"
import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"


// Define the type for progress data
interface ProgressItem {
  id: number
  value: number
  label: string
  link:string
}

// Define the component props
interface ProgressTrackerProps {
  progressData: ProgressItem[]
}

export default function ProgressTracker({ progressData }: ProgressTrackerProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Progress</h1>
      <div className="border-t border-gray-200"></div>

      <div className="flex flex-wrap justify-around gap-8 mt-8">
        {progressData.map((item) => (
          <div key={item.id} className="flex flex-col items-center">
            <CircleProgress value={item.value} />
            <div className="mt-4">
                <Link href={item.link}>
              <Button variant="outline" size="sm" className="h-8 px-3 text-gray-700 border-gray-300">
                {item.label} <ExternalLink className="ml-1 h-3.5 w-3.5" />
              </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CircleProgress({ value }: { value: number }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const size = 160
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (value / 100) * circumference

  const progressStyle = mounted
    ? { strokeDasharray: `${circumference} ${circumference}`, strokeDashoffset }
    : { strokeDasharray: `${circumference} ${circumference}`, strokeDashoffset: circumference }

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f0f0f0" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#3F66FB99"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={progressStyle}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-medium text-[#3F66FB99]">{value}%</span>
      </div>
    </div>
  )
}
