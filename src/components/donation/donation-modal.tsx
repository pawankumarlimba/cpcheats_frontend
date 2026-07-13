"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function DonationModal() {
  const [open, setOpen] = useState(false)
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="p-4  shadow-xl bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99] transition-all active:scale-95 flex items-center justify-center" >
          <Heart className="mr-2 h-4 w-4" /> Donate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Support CP Cheats</DialogTitle>
          <DialogDescription className="text-center">
            Your donations help us continue to provide great content and services
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="relative w-64 h-64 border rounded-lg overflow-hidden">
            {/* Replace this with your actual QR code image */}
            <Image src="/img/qr.png" alt="Donation QR Code" fill className="object-cover" />
          </div>
          <div className="text-center space-y-2">
              <p className="font-medium">UPI ID: ppawanlimba1@ibl</p>
              </div>
          <p className="text-sm text-center text-muted-foreground">
            Scan the QR code above to donate
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
