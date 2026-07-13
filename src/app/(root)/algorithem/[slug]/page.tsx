'use client';

import { useRouter } from "next/navigation";
import { AlgoCard } from '@/components/algorithem/algorithem-link/algorithem/algorithem';
import Pagination from '@/components/algorithem/algorithem-link/pagination/pagination';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AlgorithmCardProps } from "@/types/algorithem";
import DiscussionForum from "@/components/comment-section/comment-show";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";


interface Params {
  slug: string;
}

interface Search1 {
  name: string;
  slug:string
}
export default function Algo({ params }: { params: Promise<Params> }) {
  const { slug } = React.use(params);
  const router = useRouter();
  const [algorithem, setAlgorithem] = useState<AlgorithmCardProps | null>(null);
  const [nextName, setNextName] = useState<string | null>(null);
  const [prevName, setPrevName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 
  const [searchQuery, setSearchQuery] = useState("")
  const [searchalgo, setsearchalgo] = useState<Search1[]| null>(null); 

  useEffect(() => {
    const fetchNavItems = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/algorithm/algorithm-search", { slug });

        if (response.data) {
          setAlgorithem(response.data.algorithm || null);
          setPrevName(response.data.prevAlgorithm?.slug || null);
          setNextName(response.data.nextAlgorithm?.slug || null);
        }
      } catch (error) {
        console.error("Error fetching navigation items:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchNavItems();
    }
  }, [slug]);

  const handleNext = () => {
    if (nextName) {
      router.push(`/algorithem/${nextName.replace(/\s+/g, "-").toLowerCase()}`);
    }
  };

  const handlePrev = () => {
    if (prevName) {
      router.push(`/algorithem/${prevName.replace(/\s+/g, "-").toLowerCase()}`);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    if(searchQuery.length===0) {
     setsearchalgo(null)
     return;
    }
    e.preventDefault(); 
    try {
      setLoading(true) 
      const { data } = await axios.post('/api/algorithm/algorithm-find', 
        { searchQuery: searchQuery.trim() },
        { headers: { 'Content-Type': 'application/json' } } 
      )

       //console.log(data);
     setsearchalgo(data.response || [])
    
    } catch (error) {
      console.error('Error fetching interviews:', error)
      
    } finally {
      setLoading(false) 
    }
  }
  return (
    <div className="py-8 pt-[100px] container-fluid mx-auto">
      {loading ? (
        <div className="container-fluid mx-auto px-4 sm:px-8 mt-4 space-y-8">
          <div  className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center">
            <Skeleton className="h-[500px] w-full rounded-xl" />
            </div>
          </div>
        </div>
      ) : (
        <>
         <form onSubmit={handleSearch} className="relative w-full mb-[20px]">
          <Input
            type="text"
            placeholder="Search company name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="border border-gray-300 rounded-md p-2 pr-10 w-full"
          />
          <Search 
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer" 
            size={20} 
            onClick={handleSearch} 
          />
        </form>
        {searchalgo && searchalgo.length > 0 ? (
          
          <div className=" z-50 inset-x-0 mx-2 grid md:grid-cols-2 lg:grid-cols-3 border rounded-lg top-[80px] bg-background shadow-lg ">
            {searchalgo.filter((algo) => algo.name !==algorithem?.name).map((algo) => (
              <Link key={algo.slug} href={`/algorithem/${algo.slug}`}>
              <div  className="flex flex-col space-y-4 p-4">
               {algo.name}
              </div>
              </Link>
            ))}
          </div>
        ) : (
          algorithem && <AlgoCard item={algorithem} />
          
        )}

        {(!searchalgo || searchalgo.length === 0) && (
          <Pagination 
          prevname={prevName}
          nextname={nextName}
          onNext={handleNext} 
          onPrev={handlePrev}
        />
        
        )}
        </>
      )}
       {(!searchalgo || searchalgo.length === 0) && (
      <DiscussionForum initialPostId={slug} limitcomment={5}/>
    )}
    </div>
  );
}
