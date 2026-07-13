"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronsRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { BlogPost } from "@/types/blog";
import ReactMarkdown from "react-markdown"
import DiscussionForum from "@/components/comment-section/comment-show";
interface Params {
  slug: string;
}
export default function Interview({ params }: { params: Promise<Params> }) {
 const { slug } = React.use(params);
  

  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async (slug:string) => {
      try {
        toast.info("Fetching post...", { autoClose: 1000 });

        const { data } = await axios.post('/api/interview/interview-find',{slug});

        setPost(data.post);
        setRelatedPosts(data.relatedPosts || []);

        toast.success("Post loaded successfully!"); 
      } catch (error) {
        console.error("Error fetching post:", error);
        toast.error("Failed to load post. Please try again!");
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost(slug);
  }, [slug]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white container-fluid mb-[30px] md:mb-[50px]">
  
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="container mx-auto px-4 pt-[100px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <article className="prose prose-lg max-w-none">
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row gap-4  mb-8">
                  <h2 className="text-xl  font-bold">{post?.name}</h2>
                  <h2 className="sm:ml-auto text-sm">Posted at : {post?.date}</h2>
                </div>
                <h1 className="text-xl font-bold max-w-4xl mx-auto">
                  {post?.companyname}
                </h1>
              </div>
              <div className=" text-gray-700  ">
              <ReactMarkdown>{post?.details}</ReactMarkdown>
              </div>
            </article>
          </div>


          <aside className="lg:col-span-4 space-y-8  ">
            <div className="px-6 pb-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Related Articles
              </h2>
              <div className="space-y-4 p-2 ">
                {relatedPosts.map((relatedPost, index) => (
                  <Link
                    key={`${relatedPost._id}-${index}`}
                    href={`/interview/${relatedPost._id}`}
                    className="block group"
                  >
                    <div className="flex gap-2 transition-all duration-200 hover:shadow-md overflow-x-auto">
                      <section>
                        <ChevronsRight className="h-6 w-6 text-[#2929FF]" />
                      </section>
                      <section>
                        <h3 className="text-[#808080] font-medium group-hover:text-blue-600 transition-colors">
                          {relatedPost.companyname}
                        </h3>
                        <p className="text-sm text-[#808080] mt-1">
                        {relatedPost.details.split("").slice(0, 20).join("")}
                        {relatedPost.details.split("").length > 20 && " ..."}
                            </p>

                      </section>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
          
        </div>
        <DiscussionForum initialPostId={slug} limitcomment={5}/>
      </div>
    </div>
  );
}
