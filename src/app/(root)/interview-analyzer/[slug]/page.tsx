"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SiLeetcode } from "react-icons/si";
import DiscussionForum from "@/components/comment-section/comment-show";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";


export interface InterviewData {
  _id: string;
  company: string;
  year: number;
  slug: string;
  topics: {
    year: string;
    obj: {
      name: string;
      value: number;
    }[];
  }[];
  problems: {
    year: string;
    title: string;
    practice: string;
    frequency:string;
    difficulty: string;
  }[];
}

const topicColors = [
  "#8884d8", // Light Purple
  "#82ca9d", // Light Green
  "#ffc658", // Light Yellow
  "#ff6f61", // Coral Red
  "#6a5acd", // Slate Blue
  "#20b2aa", // Light Sea Green
  "#ff4500", // Orange Red
  "#32cd32", // Lime Green
  "#4682b4", // Steel Blue
  "#ff1493", // Deep Pink
  "#8a2be2", // Blue Violet
  "#00ced1", // Dark Turquoise
];

interface Params {
  slug: string;
}

interface Search1 {
  name: string;
  slug:string
}
export default function InterviewAnalyzer({ params }: { params: Promise<Params> }) {
  const [company, setCompany] = useState<InterviewData | null>(null);
  const [prevCompany, setPrevCompany] = useState<string | null>(null);
  const [nextCompany, setNextCompany] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("")
  const [searchalgo, setsearchalgo] = useState<Search1[]| null>(null); 
  const { slug } = React.use(params);
  const router = useRouter();

  const [radius, setRadius] = useState(150);
  const [xaxis, setXaxis] = useState(150);
  const [height, setHeight] = useState(150);
  const [piheight, setpiHeight] = useState(150);
  const [width, setWidth] = useState(150);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [buttonLoading1, setButtonLoading1] = useState<boolean>(false);

  useEffect(() => {
    const updateRadius = () => {
      if (window.innerWidth >= 1280) {
        setRadius(120);
        setXaxis(200);
        setHeight(400);
        setpiHeight(340);
        setWidth(450);
      } else if (window.innerWidth >= 768) {
        setRadius(100);
        setXaxis(115);
        setpiHeight(340);
        setHeight(280);
        setWidth(300);
      } else {
        setRadius(110);
        setXaxis(150);
        setpiHeight(400);
        setHeight(300);
        setWidth(340);
      }
    };

    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  useEffect(() => {
    const fetchNavItems = async () => {
      try {
        setLoading(true);
        const { slug } = await params;
        const response = await axios.post("/api/interview-analyzer/interview-analyzer-search", { slug });
          //console.log(response)
        if (response.data) {
          setCompany(response.data.interview || null);
          setPrevCompany(response.data.prevInterviewAnalist?.slug || null);
          setNextCompany(response.data.nextInterviewAnalist?.slug || null);
        }
      } catch (error) {
        console.error("Error fetching navigation items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNavItems();
  }, [params]);

  const handleNext = () => {
    if (nextCompany) {
      setButtonLoading(true);
      router.push(`/interview-analyzer/${nextCompany.replace(/\s+/g, "-").toLowerCase()}`);
    }
  };

  const handlePrev = () => {
    if (prevCompany) {
      setButtonLoading1(true);
      router.push(`/interview-analyzer/${prevCompany.replace(/\s+/g, "-").toLowerCase()}`);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    //console.log(searchQuery,"search")
    if(searchQuery.length===0) {
     setsearchalgo(null)
     return;
    }
    e.preventDefault(); 
    try {
      setLoading(true) 
      const { data } = await axios.post('/api/interview-analyzer/interview-analyzer-find', 
        { searchQuery: searchQuery.trim() },
        { headers: { 'Content-Type': 'application/json' } } 
      )
      
     setsearchalgo(data.response || [])
    } catch (error) {
      console.error('Error fetching interviews:', error)
      
    } finally {
      setLoading(false) 
    }
  }



  if (!company) return <p>No data available.</p>;
  const pieChartData = company.topics.flatMap((yearTopic) =>
    yearTopic.obj.map((item) => ({
      name: item.name,
      value: item.value,
    }))
  );
  const pieChartData1 = company.topics
  .flatMap((yearTopic) => yearTopic.obj)
  .reduce<{ [key: string]: number }>((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + item.value;
    return acc;
  }, {});

// Convert the aggregated object back to an array
const aggregatedPieChartData = Object.entries(pieChartData1).map(([name, value]) => ({
  name,
  value,
}));
  
  // Process topics for BarChart (grouping by year)
  const barChartData = company.topics.map((yearTopic) => {
    const yearData: Record<string, number | string> = { year: yearTopic.year };
    yearTopic.obj.forEach((item) => {
      yearData[item.name] = item.value;
    });
    return yearData;
  });
  return (
    <div className="space-y-8 container-fluid py-[90px] overflow-hidden">
              {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-12 h-12 border-4 border-[#707FDD] border-t-transparent rounded-full animate-spin"></div>
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
            {searchalgo.filter((algo) => algo.name !==company.company).map((algo) => (
              <Link key={algo.slug} href={`/interview-analyzer/${algo.slug}`}>
              <div  className="flex flex-col space-y-4 p-4">
               {algo.name}
              </div>
              </Link>
            ))}
          </div>
        ) : (
          <>
      <h1 className="text-3xl font-semibold mb-[4px]">Interview Analyzer</h1>
      <h1 className="text-3xl font-bold mb-[4px]">{company.company}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-[40px]">
        <div className="flex flex-col justify-center md:justify-auto">
        <h2 className="text-xl font-semibold">Overall Topic Distribution</h2>
        <PieChart width={width} height={piheight}>
  <Pie
    data={ aggregatedPieChartData}
    cx={xaxis}
    cy={150}
    outerRadius={radius}
    fill="#8884d8"
    dataKey="value"
    nameKey="name"
    label
  >
    { aggregatedPieChartData.map((_, index) => (
      <Cell key={`cell-${index}`} fill={topicColors[index % topicColors.length]} />
    ))}
  </Pie>
  <Tooltip />
</PieChart>

        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold">Year-wise Topic Distribution - {company.company}</h2>
          <BarChart width={width} height={height} data={barChartData}>
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          
         {Array.from(new Set(pieChartData.map((item) => item.name))).map((topicName, index) => (
          <Bar key={topicName} dataKey={topicName} fill={topicColors[index % topicColors.length]} name={topicName} />
  ))}
  <Legend/>
</BarChart>

        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Interview Questions</h2>
        <div className="overflow-x-auto bg-white shadow-xl pt-4">
          <table className="min-w-full border-collapse text-black">
            <thead className="bg-gray-100">
              <tr>
              <th className="p-4 text-left">Year</th>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Freaquency</th>
                <th className="p-4 text-center">Practice</th>
                <th className="p-4 text-center">Difficulty</th>
              </tr>
            </thead>
            <tbody>

              {company.problems.map((problem, index) => (
                <tr key={index} className="border-t">
                  <td className="p-4">{problem.year}</td>
                  <td className="p-4 max-w-[200px] whitespace-normal break-words">{problem.title}</td>
                  <td className="p-4">{problem.frequency}</td>
                  <td className="p-4 flex justify-center">
                    <a href={problem.practice} target="_blank" rel="noopener noreferrer"><SiLeetcode /></a>
                  </td>
                  <td  className={`p-4 text-center ${
              problem.difficulty === "Easy"
              ? "bg-green-100 text-green-600"
             : problem.difficulty === "Medium"
           ? "bg-yellow-100 text-yellow-600"
           : "bg-red-100 text-red-600"
            }`}>{problem.difficulty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
)}
     {(!searchalgo || searchalgo.length === 0) && (
      <div className="flex justify-between mt-[10px]">
            <Button className=" mr-auto bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99] shadow-xl text-white" onClick={handlePrev} disabled={!prevCompany || buttonLoading1}>{buttonLoading1 ? "Loading..." : (prevCompany ? prevCompany : "Previous")}</Button>
            <Button className="ml-auto bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99]  shadow-xl text-white" onClick={handleNext} disabled={!nextCompany || buttonLoading}>{buttonLoading ? "Loading..." : (nextCompany ? nextCompany : "Next")}</Button>
      </div>
    )}
      </>
        )}
         {(!searchalgo || searchalgo.length === 0) && (
        <DiscussionForum initialPostId={slug} limitcomment={5}/>
         )}
    </div>
  );
}
