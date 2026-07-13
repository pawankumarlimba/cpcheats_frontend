"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { initSocket } from "../../../../lib/socket";
import Peer, { MediaConnection } from "peerjs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeEditor from "@/components/live-interview/editor";
import { toast } from "react-toastify";
import { Copy, LogOut, Mic, MicOff, Users, Video, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import io from "socket.io-client";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getCookie } from "@/lib/cookies";



// Interfaces for type safety
interface Client {
  userName: string;
  socketId: string;
}

interface PeerConnection {
  id: string;
  call: MediaConnection;
}

interface Params {
  slug: string;
}




const EditorPage = ({ params }: { params: Promise<Params> }) => {
  const { slug } = React.use(params);
  const router = useRouter();
  const roomId = slug;
  const[userName,setuserName]=useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const codeRef = useRef<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const peerInstanceRef = useRef<Peer | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<PeerConnection[]>([]);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isMuted, setIsMuted] = useState(false);


  useEffect(() => {

    const logintoken = getCookie('token1');
    if (logintoken) {
      //console.log(logintoken)
      finduser(logintoken);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      window.location.replace("/login");
    }

  }, [isLoggedIn]);

  const finduser = async (accessToken: string) => {
    try {
      const response = await axios.post("/api/client/finduser", { accessToken });
      //console.log(response.data.user); 
      if (response.data.success) {
       
        setuserName(response.data.user.username); 

      } else {
        toast.error(response.data.error || "An error occurred");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || "An error occurred");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };
  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOff(!videoTrack.enabled);
      }
    }
  };

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      const handleError = () => {
        toast.error("Server Error. Please try again!");
        router.push("/");
      };

      socketRef.current?.on("connect_error", handleError);
      socketRef.current?.on("connect_failed", handleError);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        streamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Initialize PeerJS
        const peer = new Peer();
        peerInstanceRef.current = peer;

        peer.on("open", (peerID: string) => {
          socketRef.current?.emit("join-room", { roomId, peerID, userName });
        });

        // Handle new user connection
        socketRef.current?.on(
          "user-connected",
          ({ peerID, clients, userName }: { peerID: string; clients: Client[]; userName: string }) => {
            toast.success(`${userName} joined`);
            setClients(clients);
            
            // Ensure no duplicate connections
            if (!peersRef.current.some((p) => p.id === peerID)) {
              const call = peer.call(peerID, stream);

              if (call) {
                call.on("stream", (userStream) => {
                  addVideoStream(userStream, peerID);
                });

                peersRef.current.push({ id: peerID, call });
              }
            }
          }
        );

        // Handle incoming calls
        peer.on("call", (call) => {
          call.answer(stream);
          call.on("stream", (userStream) => {
            addVideoStream(userStream, call.peer);
          });
        });

        // Handle user disconnect
        socketRef.current?.on("user-disconnected", ({ peerID, userName }: { peerID: string; userName: string }) => {
          toast.success(`${userName} left`);
          removeVideo(peerID);
          peersRef.current = peersRef.current.filter((p) => p.id !== peerID);
        });
    
      } catch (error) {
        console.log(error)
        toast.error("Failed to access media devices.");
    
      }
    };

    init();

    return () => {
      // Cleanup media stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      socketRef.current?.disconnect();
    };
  }, []);

  // Function to add video stream
  const addVideoStream = (stream: MediaStream, id: string) => {
    // Skip adding local stream to remote video grid
    if (id === peerInstanceRef.current?.id) return;

    // Ensure no duplicate video elements
    if (!document.getElementById(id)) {
      const video = document.createElement("video");
      video.srcObject = stream;
      video.id = id;
      video.autoplay = true;
      video.playsInline = true;
      video.className = "rounded-lg border w-full h-full";
      document.getElementById("remote-video-grid")?.appendChild(video);
    }
  };

  const removeVideo = (peerID: string) => {
    const video = document.getElementById(peerID);
    video?.remove();
  };


  const handleLeave = () => {
    toast.success("You left the room");
    router.push("/");
  };

  // Function to copy Room ID
  const handleCopyRoomId = async () => {
    await navigator.clipboard.writeText(`https://www.cpcheats.in/live-interview/${roomId}`);
    toast.success("link is  copied!");
  };

  return (
    <div className="container-fluid mx-auto p-4 pt-[80px] min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <header className="flex flex-row justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Technical Interview
            </h1>
            <Badge variant="outline" className="hidden sm:flex px-2 py-1 text-xs">
              Room: {roomId.substring(0, 8)}...
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleCopyRoomId} variant="outline" size="icon" className="shadow-sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy interview link</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="destructive" size="icon" onClick={handleLeave} className="shadow-sm">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>End interview</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </header>

        <Separator className="my-2" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Video section - collapsible on mobile */}
          <div
            className={`lg:col-span-4 space-y-2  transition-all duration-300 ease-in-out`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-primary" />
                <h2 className="font-semibold">Participants ({clients.length})</h2>
              </div>
            </div>
            <Card className="overflow-hidden">
            <CardContent className="p-4 relative min-h-40">
            <div className="absolute bottom-6 right-6 z-10 w-36 h-24 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
    <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
    {/* Controls Inside Local Video */}
    <div className="absolute bottom-2 left-2 flex space-x-2">
      <button
        onClick={toggleMute}
        className={`p-2 rounded-full text-white transition ${isMuted ? 'bg-red-500' : 'bg-green-500'}`}
      >
        {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </button>
      <button
        onClick={toggleCamera}
        className={`p-2 rounded-full text-white transition ${isCameraOff ? 'bg-red-500' : 'bg-green-500'}`}
      >
        {isCameraOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
      </button>
    </div>
  </div>

  {/* Remote Video Grid */}
  <div id="remote-video-grid" className="grid grid-cols-1  gap-4">
    {/* Remote videos will be added here */}
    {clients.length === 0 && (
                          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                            <Users className="h-10 w-10 mb-2 opacity-20" />
                            <p>Waiting for others to join...</p>
                            <p className="text-xs mt-2">Share the link to invite participants</p>
                          </div>
                        )}
                      </div>
                  
                </CardContent>
              </Card>

          </div>
          {/* Code editor section */}
          <div className="lg:col-span-8 space-y-4">
            <Card className="shadow-sm border overflow-hidden">
              <Tabs defaultValue="code" className="w-full">
                <TabsList className="w-full rounded-none border-b">
                  <TabsTrigger value="code" className="flex-1">
                    Code Editor
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="code" className="p-0 m-0">
                  <div className="h-[calc(100vh-280px)] min-h-[400px]">
                    <CodeEditor
                      socketRef={socketRef}
                      roomId={roomId}
                      onCodeChange={(code) => (codeRef.current = code)}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;