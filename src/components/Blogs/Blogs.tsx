"use client"
import React, { useEffect, useState } from 'react';
import { BlogCard } from './blog-card';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { Skeleton } from '../ui/skeleton';

interface BlogPost {
  _id: string;
  name: string;
  issee: boolean;
  isemail: boolean;
  date: string;
  companyname: string;
  subdetails: string;
  details: string;
  slug: string;
  bgColor: string;
}

const Blogs = () => {
  const [interview, setInterview] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await axios.post('/api/interview/show-home-interview');
        //console.log(response.data.interviews);

        const bgColors = ["bg-red-200", "bg-blue-200", "bg-green-200", "bg-yellow-200", "bg-purple-200"];

        const interviewsWithBgColor = response.data.interviews.map((item: BlogPost, index: number) => ({
          ...item,
          bgColor: bgColors[index % bgColors.length],
        }));

        setInterview(interviewsWithBgColor);
      } catch (error) {
        console.error('Error fetching interviews:', error);
      } finally {
        setLoading(false); // Stop loading after data fetch
      }
    };

    fetchInterviews();
  }, []);

  return (
    <div className="bg-gradient-to-b from-white via-blue-50 to-gray-50">
      <div className="container-fluid px-4 sm:px-6 lg:px-8">
        <section className="mt-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl md:text-3xl font-semibold">Interview experience</h3>
            <Link href="/interview">
              <button className="text-white flex gap-1 items-center shadow-lg bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99] rounded-full border px-4 py-2 text-sm">
                View All
                <ChevronRight size={15} />
              </button>
            </Link>
          </div>

          <div className="container-fluid px-4 sm:px-8 mt-4">
            {loading ? (
              <div className="container-fluid grid grid-cols-1 md:grid-cols-3 sm:px-8 c space-y-8">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-[200px] w-full rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <BlogCard items={interview} />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Blogs;
