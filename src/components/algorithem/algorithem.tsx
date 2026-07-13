import React, { useEffect, useState } from 'react';
import { CaseCard } from './algorithem-card';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { Skeleton } from '../ui/skeleton';

export interface AlgorithmCardProps {
  _id: string;
  name: string;
  description: string;
  slug:string;
  timeComplexity: string;
  spaceComplexity: string;
  use: string;
  user: string;
  code: Record<string, string>;
  execute: (input: string, setOutput: React.Dispatch<React.SetStateAction<string>>) => Promise<void>;
  bgColor: string;
}

const Case = () => {
  const [algorithm, setAlgorithm] = useState<AlgorithmCardProps[]>([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    let isMounted = true; // Track whether the component is mounted

    const fetchAlgorithms = async () => {
      try {
        const response = await axios.post('/api/algorithm/show-home-algorithm');
        //console.log(response.data.algorithm);

        const bgColors = ["bg-[#F5FFBF]", "bg-[#B3FFD9]", "bg-[#FFE0B3]"];

        if (isMounted) {
          const algorithmWithBgColor = response.data.algorithm.map((item: AlgorithmCardProps, index: number) => ({
            ...item,
            bgColor: bgColors[index % bgColors.length],
          }));

          setAlgorithm(algorithmWithBgColor);
        }
      } catch (error) {
        console.error('Error fetching algorithm:', error);
      } finally {
        if (isMounted) setLoading(false); // Stop loading only if the component is still mounted
      }
    };

    fetchAlgorithms();

    return () => {
      isMounted = false; // Cleanup to prevent state updates on unmounted component
    };
  }, []);

  return (
    <div className="bg-gradient-to-b from-white via-blue-50 to-gray-50 py-8">
      <div className="container-fluid mx-auto px-4 sm:px-6 lg:px-8">
        <section className="bg-gradient-to-b from-white via-blue-50 to-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="text-xl md:text-3xl font-semibold">Algorithm</h3>
            <Link href="algorithem/binary-search">
              <button className="text-white flex gap-1 items-center shadow-lg bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99] rounded-full border px-4 py-2 text-sm">
                View All
                <ChevronRight size={15} />
              </button>
            </Link>
          </div>

          {loading ? (
            <div className="container-fluid mx-auto px-4 sm:px-8 mt-4 space-y-8">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex justify-between items-center">
                  <Skeleton className="h-[500px] w-full rounded-xl" />
                  </div>
                </div>
              ))} 
              </div>
          ) : (
            <div className="container-fluid mx-auto px-4 sm:px-8 mt-4 space-y-8">
              {algorithm.map((item) => (
                <CaseCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Case;
