"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { X, Copy, Check, Terminal } from "lucide-react"
import { toast } from "react-toastify"

interface DrawerProps {
  open: boolean
  setOpen: (open: boolean) => void
  output: string
  hasError?: boolean
}

// Note: the main code editor now shows results in an inline console panel
// so results sit next to the code instead of covering the screen. This
// drawer is kept for any secondary surface that still wants a modal view.
export function DrawerDemo({ open, setOpen, output, hasError }: DrawerProps) {
  const [copied, setCopied] = React.useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      toast.success("Output has been copied to clipboard.")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.log(err)
      toast.error("Could not copy to clipboard.")
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="p-4 bg-white border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
            <Terminal className="h-4 w-4" />
            Console output
          </div>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-800">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </div>

        <div className="w-full mt-3">
          <DrawerHeader className="p-0">
            <DrawerTitle className="sr-only">Program output</DrawerTitle>
            <DrawerDescription asChild>
              <pre
                className={
                  "text-left text-sm font-mono whitespace-pre-wrap break-words rounded-lg bg-slate-50 border border-slate-100 p-4 max-h-[40vh] overflow-auto " +
                  (hasError ? "text-red-600" : "text-slate-700")
                }
              >
                {output || "No output yet."}
              </pre>
            </DrawerDescription>
          </DrawerHeader>
        </div>

        <DrawerFooter className="px-0">
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="ml-auto gap-2 border-slate-200 text-slate-600 hover:text-slate-900"
            disabled={!output}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}