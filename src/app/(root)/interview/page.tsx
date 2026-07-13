'use client'

import { useState, useEffect } from 'react'
import { Search, Plus } from 'lucide-react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Pagination from './pagination'
import { toast } from 'react-toastify'
import { BlogPost } from '@/types/blog'
import RegisterNow from './user-experiance/user-form'
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { BlogCard } from '@/components/Blogs/blog-card'

const ITEMS_PER_PAGE = 9

interface RegisterNowProps {
  name: string;
  companyname: string;
  details: string;
}


const bgColors = ["bg-[#E3E3E3]"];


export default function InterviewPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [interview, setInterview] = useState<BlogPost[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState<boolean>(false) // Added loading state

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setLoading(true) // Start loading
        // console.log("Fetching page:", currentPage)
        const { data } = await axios.get('/api/interview/show-interview', {
          params: { page: currentPage, limit: ITEMS_PER_PAGE },
        })
        const interviewsWithBgColor = data.blogs.map((item: BlogPost, index: number) => ({
          ...item,
          bgColor: bgColors[index % bgColors.length],
        }));
        setInterview(interviewsWithBgColor || [])
        setTotalPages(data.totalPages)
      } catch (error) {
        console.error('Error fetching interviews:', error)
        setInterview([])
      } finally {
        setLoading(false) // Stop loading
      }
    }

    fetchInterviews()
  }, [currentPage])


  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    //console.log('Searching for:', searchQuery);
    try {
      setLoading(true) // Start loading for search
      const { data } = await axios.post('/api/interview/interview-search',
        { searchQuery: searchQuery.trim() },
        { headers: { 'Content-Type': 'application/json' } }
      )

      setInterview(data.interview || [])
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error fetching interviews:', error)
      setInterview([])
    } finally {
      setLoading(false) // Stop loading
    }
  }

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
  }

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const handleRegister = async (data: RegisterNowProps) => {
    try {
      const response = await axios.post('/api/interview/interview-send', data)
      if (response.data.success) {
        toast.success('Interview added successfully! It will be visible after admin verification.')
        setTimeout(() => {
          window.location.replace('/interview')
        }, 1000)
      } else {
        toast.error(response.data.error || 'An error occurred')
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'An error occurred');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    }

  }






  return (
    <div className="flex flex-col min-h-screen  pt-[100px]">
      <div className="flex container-fluid flex-row gap-4 w-full mb-[20px]">
        <form onSubmit={handleSearch} className="relative w-full">
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
        <div className="flex flex-row gap-4">
          <Drawer>
            <DrawerTrigger asChild>
              <Button className="text-white flex gap-1 items-center shadow-lg bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99] rounded-md border px-4 py-2 text-sm">
                <Plus />
                Add
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerTitle>
                <RegisterNow onRegister={handleRegister} />
              </DrawerTitle>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      <div className="container-fluid px-8 mt-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-[#707FDD] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <BlogCard items={interview} />
        )}
      </div>

      <div className="mt-auto mb-[20px]">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={handleNextPage}
          onPrev={handlePrevPage}
        />
      </div>
    </div>
  )
}











