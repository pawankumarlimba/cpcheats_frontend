"use client"

import React, { useEffect, useState } from 'react'

import ProjectCard from '@/components/adminsection/AdminProject'
import { toast } from 'react-toastify'
import axios from 'axios'
import { BlogPost } from '@/types/blog'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import LoginNow from '@/components/adminsection/login/page'




export default function AdminProject() {

  const [interview, setInterview] = useState<BlogPost[]>([]) 
  const [loading, setLoading] = useState<boolean>(false) 
  const [loadingbutton, setLoadingbutton] = useState<string |null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
 

  useEffect(() => {
    const logintoken = localStorage.getItem('token');
    //console.log(logintoken);
    if (logintoken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    const fetchInterviews = async () => {
      try {
        setLoading(true) // Start loading
        const  data  = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/interview/show-interview-all`)
        setInterview(data.data.interviews || [])
      } catch (error) {
        console.error('Error fetching interviews:', error)
        setInterview([])
      } finally {
        setLoading(false) 
      }
    }

    fetchInterviews()
  }, [])

  const handlesendmail = async (id: string) => {
    try {
      setLoadingbutton(id)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/news-latter/sending-mail`, { id }); 
      if (response.status==200) {
        
        toast.success(response.data.message);
      } else {
        toast.error(response.data.error || 'An error occurred');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'An error occurred');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    }finally {
      setLoadingbutton(null) 
    }
  };



  const handleLogin = async (data:{ email: string; password: string }) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, data);
      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem('token', response.data.user.accessToken);
        window.location.replace('/admin-newsletters');
      } else {
        toast.error(response.data.error || 'An error occurred');
      }
    }  catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || 'An error occurred');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <Dialog open={true}>
        <DialogContent className='max-w-[350px] md:max-w-[400px] rounded-2xl'>
          <DialogTitle>
            <LoginNow onRegister={handleLogin} />
          </DialogTitle>
        </DialogContent>
      </Dialog>
    );
  }



  return (
    <div className="w-full border-t-[1px] py-[80px] flex flex-col justify-center items-center  max-w-screen-xl mx-auto"> 
  {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-[#707FDD] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 px-4  mt-4">
          {interview.map((project, index) => (
            <ProjectCard
              key={index}
              name={project.name}
              onSend={() => handlesendmail(project._id)} 
              isLoading={loadingbutton === project._id} 
              companyname={project.companyname}
              isEmail={project.isemail}
              status={project.issee}
              />
          ))}
        </div>
        )}
      </div>
   
  );
}

