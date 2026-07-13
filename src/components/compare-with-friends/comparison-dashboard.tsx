"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import TopicComparisonChart from "./topic-comparison-chart";
import ProgressOverTimeChart from "./progress-over-time-chart";
import axios from "axios";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { getCookie } from "@/lib/cookies";

interface IUser {
  username: string;
  name: string;
  email: string;
  accessToken: string;
}

interface DataCount {
  neetcodesolve: number;
  neetcodetotal: number;
  lovebabersolve: number;
  lovebabertotal: number;
  solve: number;
  staiversolve: number;
  staivertotal: number;
  total: number;
}

export default function ComparisonDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<IUser | null>(null);
  const [friend, setFriend] = useState<IUser | null>(null);
  const [friendUsername, setFriendUsername] = useState("");
  const [datacount, setDatacount] = useState<DataCount | null>(null);
  const [frienddatacount, setFrienddatacount] = useState<DataCount | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const logintoken = getCookie("token1");
    if (logintoken) {
      findUser(logintoken);
    } else
     {
      router.push("/login"); 
    }
  }, []);


  const finduserquestiondata = async (userId: string) => {
    try {
      const response = await axios.post("/api/questions/user-solve", { userId });
      if (response.status === 200) {
        setDatacount(response.data);
      } else {
        toast.error(response.data.error || "An error occurred");
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong. Please try again.");
    }
  };

  const findfriendquestiondata = async (userId: string) => {
    try {
      const response = await axios.post("/api/questions/user-solve", { userId });
      if (response.status === 200) {
        setFrienddatacount(response.data);
      } else {
        toast.error(response.data.error || "An error occurred");
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong. Please try again.");
    }
  };

  const findUser = async (accessToken: string) => {
    try {
      const response = await axios.post("/api/client/finduser", { accessToken });
      if (response.data.success) {
        setUser(response.data.user);
        finduserquestiondata(response.data.user.username);
      } else {
        toast.error(response.data.error || "An error occurred");
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong. Please try again.");
    }
  };

  const friendDetails = async () => {
    if (!friendUsername) {
      toast.error("Please enter a friend's username");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/client/finduser", { accessToken: friendUsername });
      if (response.data.success) {
        setFriend(response.data.user);
        findfriendquestiondata(response.data.user.username);
        setFriendUsername("");
      } else {

        toast.error(response.data.error || "Friend not found");
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid space-y-6 pt-[80px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Problem Solving Comparison</h1>
          <p className="text-muted-foreground">Compare your problem-solving progress with your friend</p>
        </div>
        <div className="flex items-center gap-2">
          <Input 
            type="text" 
            placeholder="Enter friend's username" 
            value={friendUsername} 
            onChange={(e) => setFriendUsername(e.target.value)} 
          />
          <Button onClick={friendDetails} disabled={loading } className="bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99]">
            {loading ? "Loading..." : "Find Friend"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">You</CardTitle>
            <CardDescription>Your problem-solving statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{datacount ? datacount.solve : "-"}</div>
            <div className="text-sm text-muted-foreground">Total Problems Solved</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">{friend ? friend.name : "Your Friend"}</CardTitle>
            <CardDescription>Their problem-solving statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{frienddatacount ? frienddatacount.solve : "-"}</div>
            <div className="text-sm text-muted-foreground">Total Problems Solved</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="topics">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="topics" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" /> Topics
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" /> Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="topics">
          <Card>
            <CardContent>
              {friend ? (
                <TopicComparisonChart 
                  data={[
                    {
                      topic: "Total",
                      you: datacount?.solve || 0,
                      friend: frienddatacount?.solve || 0,
                    },
                    {
                      topic: "Staiver sheet",
                      you: datacount?.staiversolve || 0,
                      friend: frienddatacount?.staiversolve || 0,
                    },
                    {
                      topic: "Love Baber",
                      you: datacount?.lovebabersolve || 0,
                      friend: frienddatacount?.lovebabersolve || 0,
                    },
                    {
                      topic: "Neetcode-150",
                      you: datacount?.neetcodesolve || 0,
                      friend: frienddatacount?.neetcodesolve || 0,
                    },
                  ]}
                />
              ) : (
                <div className="text-center text-muted-foreground text-lg py-20">
                  Enter your friend`&apos;`s username for comparison
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          {friend ? (
            <ProgressOverTimeChart 
              userId={user?.username || ""} 
              friendId={friend?.username || ""}
            />
          ) : (
            <Card>
              <CardContent>
                <div className="text-center text-muted-foreground text-lg py-20">
                  Enter your friend`&apos;`s username for comparison
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
