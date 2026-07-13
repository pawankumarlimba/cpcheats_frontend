"use client";
import Blogs from "@/components/Blogs/Blogs";
import Case from "@/components/algorithem/algorithem";
import Footer from "@/components/layouts/footer/footer";
import FeaturesSection from "../our-features/features";
import Hero from "../herosection/hero-section";
import { MessageCircle, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import AITextGenerator from "../ai-text-generator/ai-text";
import DonationModal from "../donation/donation-modal";

export default function Home() {
  return (
    <main>
      <Hero />
      <Case />
      <FeaturesSection />
      <div className="container-fluid w-full flex items-end justify-end ">
        <div className="fixed bottom-28 group flex items-center gap-2 z-50">
          <DonationModal />
        </div>
        <div className="fixed bottom-12 group flex items-center gap-2 z-50">
          <span className="text-black text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Chat with AI
          </span>

          {/* Chat Button with Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="p-4 rounded-full shadow-xl bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99] transition-all active:scale-95 flex items-center justify-center"
                aria-label="Open AI Chat"
              >
                <MessageCircle className="w-[40px] h-[40px]" />
              </Button>
            </DialogTrigger>


            <DialogContent className="sm:max-w-[1000px] overflow-y-auto max-h-[500px]">
              <DialogTitle className="text-center w-full">
                <div className="text-center mb-6">
                  <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#9BA9FB] to-[#3F66FB] bg-clip-text text-transparent flex items-center justify-center gap-2">
                    <Sparkles className="h-6 w-6 text-[#707FDD]" />
                    CP Cheats AI Mentor
                  </h2>
                </div>
              </DialogTitle>
              <DialogHeader>
                <DialogDescription>
                  <AITextGenerator />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Blogs />
      <Footer />
    </main>
  );
}

