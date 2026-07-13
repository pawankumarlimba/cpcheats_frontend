"use client"
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import {  Ban, MessageSquareText, Reply, ThumbsUp, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import RegisterNow from "./comment-section";
import axios from "axios";
import { IconLeft, IconRight } from "react-day-picker";
import Link from "next/link";
import { getCookie } from "@/lib/cookies";


interface Reply {
  replyid:string;
  commentid: string; 
  username: string; 
  content: string; 
}

interface Obj{
  _id:string;
  user:string;
}

interface Post {
  _id: string;
  user: string; 
  data: string; 
  upvotes: Obj[]; 
  replies: Reply[]; 
}

interface DiscussionForumProps {
  initialPostId: string; 
  limitcomment:number;
}

export default function DiscussionForum({ initialPostId,limitcomment }: DiscussionForumProps) {
  const [posts, setPosts] = useState<Post[] | null>(null); 
  const [user, setuser] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [buttonLoading1, setButtonLoading1] = useState<boolean>(false);
  const [showRepliesState, setShowRepliesState] = useState<Record<string, boolean>>({}); 
  const [showReplyInputState, setShowReplyInputState] = useState<Record<string, boolean>>({});
  const [showTooltip, setShowTooltip] = useState<Record<string, boolean>>({});
const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const handlePostSubmit = async (data: string): Promise<void> => {
    if(data==""){
      toast.error("write your message")
      return
    }
    try {
      const response = await axios.post("/api/comment/send-comment", { data, initialPostId, user });
      if (response.data.success) {
        toast.success("comment added successfully");
        fetchComments(initialPostId, currentPage);
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

  const fetchComments = async (initialPostId: string, currentPage: number) => {
    try {
      const response = await axios.get("/api/comment/show-comment", {
        params: {
          initialPostId,
          currentPage,
          limit: limitcomment,
        },
      });

      setPosts(response.data.comments);  
      setTotalPages(response.data.totalPages);
      setButtonLoading(false);
      setButtonLoading1(false);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
    }
  };

  const finduser = async (accessToken: string) => {
    try {
      const response = await axios.post("/api/client/finduser", { accessToken });
      //console.log(response.data.user.username); // This will log the username correctly
      if (response.data.success) {
        setuser(response.data.user.username); // This updates the state
        fetchComments(initialPostId, currentPage); // Fetch comments after user is set
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
  


  useEffect(() => {
    const logintoken = getCookie('token1');
    if (logintoken) {
     finduser(logintoken);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    fetchComments(initialPostId, currentPage);
  }, [initialPostId, currentPage]);

  const handleUpvote = async(commentid: string,user:string) => {
    try {
      const response = await axios.post("/api/comment/like-handle", {commentid,user });
      if (response.data.success) {
        //toast.success("like add");
        fetchComments(initialPostId, currentPage);
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

  const toggleReplies = (postId: string) => {
    setShowRepliesState((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleReplyInput = (postId: string) => {
    setShowReplyInputState((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleReplySubmit = async (commentid: string, content: string, username: string) => {
    try {
      const response = await axios.post("/api/comment/send-reply", { commentid, content, username });
      if (response.data.success) {
        toast.success("Reply added!");
        fetchComments(initialPostId,currentPage);
        setShowReplyInputState((prev) => ({ ...prev, [commentid]: false }));
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
  const handleDeleteComment = async (commentid: string) => {
    try {
      const response = await axios.post("/api/comment/comment-delete", {commentid });
     
      if (response.data.success) {
        toast.success("Comment deleted!");
        fetchComments(initialPostId, currentPage);
      } else {
        toast.error(response.data.error || "An error occurred");
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to delete comment. Please try again.");
    }
  };


  const handleDeleteReply = async (commentid: string, replyid: string) => {
   
    try {
      const response = await axios.post(`/api/comment/reply-delete`, {commentid, replyid  });
      if (response.data.success) {
        toast.success("Reply deleted!");
        fetchComments(initialPostId, currentPage);
      } else {
        toast.error(response.data.error || "An error occurred");
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to delete reply. Please try again.");
    }
  };

  const handleNextPage = () => {
    setButtonLoading1(true)
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
  }

  const handlePrevPage = () => {
    setButtonLoading(true)
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }


const handleMouseEnter = (postId: string) => {
  if (!isLoggedIn) {
    setShowTooltip((prev) => ({ ...prev, [postId]: true }));
  }
};

const handleMouseLeave = (postId: string) => {
  setShowTooltip((prev) => ({ ...prev, [postId]: false }));
};

// Function to generate color based on name or email
const getColorFromString = (str:string) => {
  const colors = [
    "#F44336", "#E91E63", "#9C27B0", "#673AB7",
    "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4",
    "#009688", "#4CAF50", "#8BC34A", "#CDDC39",
    "#FFC107", "#FF9800", "#FF5722", "#795548",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

  return (
    <div className="space-y-6">
      <h1 className="text-xl md:text-2xl font-bold">Comment section</h1>
      <div className="px-4 sm:px-8">

      <RegisterNow isloggedin={isLoggedIn} onRegister={handlePostSubmit} />

      <div className="py-6 px-4 shadow-xl">
        {posts?.map((post) => (
          <div key={post._id} className="mb-4">
            <div className="flex gap-2 items-center">
            <div
          className={`rounded-full p-2 h-[20px] w-[20px] text-[10px] text-white flex items-center justify-center ring-4 ring-white`}
          style={{ backgroundColor: getColorFromString(post.user) }}
        >
          {post.user.charAt(0).toUpperCase()}
      </div>
      <p className="text-sm text-gray-500"> {post.user}</p>
      </div>
            <div className="flex item-center gap-2 text-gray-700">
            <ReactMarkdown>{post.data}</ReactMarkdown>
            {post.user === user && (
              
                <Button className="ml-auto text-red" onClick={() => handleDeleteComment(post._id)} variant="ghost">
                  <Trash2 className="text-red"/>
                </Button>
              )}
            </div>
           
            <div className="flex gap-1">
            <div
              onMouseEnter={() => handleMouseEnter(post._id)}
              onMouseLeave={() => handleMouseLeave(post._id)}
              className="relative"
            >
              <Button onClick={() => handleUpvote(post._id,user)} variant="ghost">
                {post.upvotes.length} <ThumbsUp size={8} />
              </Button>
              {!isLoggedIn && showTooltip[post._id] && (
                <Link href={"/login"}>
                <Button className="absolute left-0 top-0 hover:bg-white" variant="ghost">
                 <Ban size={8}/>
                </Button>
                </Link>
              )}
             </div>
             <Button onClick={() => toggleReplies(post._id)} variant="ghost" className="gap-x-1 flex items-center">
  <MessageSquareText /> 
  <p className="hidden md:flex"> {showRepliesState[post._id] 
    ? `Hide ${post.replies.length - 1 > 0 ? `${post.replies.length - 1} Replies` : 'Reply'}` 
    : `See ${post.replies.length - 1 > 0 ? `${post.replies.length - 1} Replies` : 'Reply'}`}</p>
</Button>


              <Button onClick={() => toggleReplyInput(post._id)} variant="ghost" className="gap-x-1 flex items-center">
                <Reply/>
                <p className="hidden md:flex">{showReplyInputState[post._id] ? "Cancel" : "Reply"}</p>
              </Button>

            </div>

            {showReplyInputState[post._id] && (
              <div className="mt-2">
                <RegisterNow isloggedin={isLoggedIn} onRegister={(data) => handleReplySubmit(post._id, data, user)} />
              </div>
            )}

            {showRepliesState[post._id] &&
              post.replies.map((reply) => (
                <div key={reply.replyid} className="px-1 md:px-4 mt-2">
                              <div className="flex gap-2 items-center">
      <p className="text-sm text-gray-500"> {reply.username}</p>
      </div>
                  <div className="flex item-center gap-2">
                  <ReactMarkdown>{reply.content}</ReactMarkdown>
                  {reply.username === user && (
                    <Button className="ml-auto text-red" onClick={() => handleDeleteReply(post._id, reply.replyid)} variant="ghost">
                      <Trash2/>
                    </Button>
                    
                  )}
                  </div>
                </div>
              ))}
          </div>
        ))}
         <div className="flex justify-center mt-[10px] gap-[50px] md:gap-[100px]">
                    <Button className=" shadow-xl bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99]" onClick={handlePrevPage} disabled={currentPage === 1}>{buttonLoading ? "Loading..." : <IconLeft />}</Button>
                    <Button className=" shadow-xl bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99]" onClick={handleNextPage} disabled={currentPage === totalPages || totalPages===0}>{buttonLoading1 ? "Loading..." : <IconRight/>}</Button>
              </div>
      </div>
      </div>
    </div>
  );
}
