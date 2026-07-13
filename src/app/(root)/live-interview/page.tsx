"use client";

import { useState, FormEvent, KeyboardEvent, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { DoorOpen, Users, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCookie } from "@/lib/cookies";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Home = () => {
  const [roomId, setRoomId] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const logintoken = getCookie("token1");
    setIsLoggedIn(!!logintoken);
  }, []);

  const createRoomId = (e: FormEvent) => {
    e.preventDefault();
    const id = uuid();
    setRoomId(id);
    toast.success("Created a new Room");
  };

  const joinRoom = () => {
    if (!roomId) {
      toast.error("Room ID is required");
      return;
    }
    router.push(`/live-interview/${roomId}`);
  };

  const handleInputEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter" && isLoggedIn) {
      joinRoom();
    }
  };

  const redirectToLogin = () => {
    router.push("/login");
  };

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-900 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Card 1: Live Interview with Friends */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={openDialog}>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Live Interview with Friends</CardTitle>
            <CardDescription className="text-center">
              Collaborate with friends in real-time interviews.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Card 2: Interview with AI */}
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/live-interview/ai-interview")}
        >
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <Bot className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Interview with AI</CardTitle>
            <CardDescription className="text-center">
              Practice interviews with an AI-powered interviewer.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Dialog for Live Interview with Friends */}
      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
          <div className="flex items-center justify-center mb-2">
              <Users className="h-10 w-10 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold">Join a Live Interview</DialogTitle>
            <DialogDescription>
              Enter a Room ID or create a new one to start a live interview with friends.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyUp={handleInputEnter}
            />
            {isLoggedIn ? (
              <Button
                className="w-full shadow-xl bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99]"
                onClick={joinRoom}
              >
                <DoorOpen className="h-5 w-5 mr-2" />
                Join Room
              </Button>
            ) : (
              <Button
                className="w-full shadow-xl bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99]"
                onClick={redirectToLogin}
              >
                Log in to Join
              </Button>
            )}
            <p className="text-sm text-gray-600 text-center">
              No Room ID?{" "}
              <a
                href="#"
                onClick={createRoomId}
                className="text-blue-500 hover:text-blue-400 font-medium"
              >
                Create a new room
              </a>
            </p>
          </div>
          {/* Dialog Footer */}
          <DialogFooter className="text-sm text-gray-500 text-center py-4">
  Guided by&nbsp;
  <span className="text-blue-500 font-semibold">Mohit Kumawat</span>
</DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Home;