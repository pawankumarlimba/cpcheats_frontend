'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Linkedin, Github, Instagram } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface SocialLink {
  href: string;
  icon: React.ReactElement;
  label: string;
}

export default function Footer() {
  const [isClient, setIsClient] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async (email: string) => {
    if (!email.trim()) {
      toast.error('Please enter a valid email');
      return;
    }

    setLoading(true); // Start loading

    try {
      const response = await axios.post('/api/news-latter/store-mail', { email });
      if (response.data.success) {
        toast.success(response.data.message);
        window.location.reload();
      } else {
        toast.error(response.data.error || 'An error occurred');
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const links: SocialLink[] = [
    {
      href: 'https://www.linkedin.com/in/pawan-kumar-485903270/',
      icon: <Linkedin size={24} />,
      label: 'LinkedIn',
    },
    {
      href: 'https://github.com/pawankumarlimba',
      icon: <Github size={24} />,
      label: 'GitHub',
    },
    {
      href: 'https://www.instagram.com/pawanlimbaa/?next=%2Fkoreyography%2F',
      icon: <Instagram size={24} />,
      label: 'Instagram',
    },
  ];

  if (!isClient) {
    return null;
  }

  return (
    <div className="overflow-hidden mt-[70px]">
      <div className="bg-transparent sm:h-[60px] h-[120px]"></div>
      <footer className="bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99] text-white relative pb-4 max-w-[100%]">
        <div className="mx-auto container-fluid max-w-[100%] font-garet">
          <div className="transform translate-y-[-50%]">
            <div className="mx-auto h-[220px] md:h-[120px] flex rounded-lg bg-white py-3 sm:p-8 shadow-lg px-4">
              <div className="flex flex-col md:flex-row md:items-center lg:justify-between gap-6 w-full">
                <div>
                  <h2 className="text-xl sm:text-2xl font-montserrat font-bold text-black mb-2">
                    Join Our Quarterly Newsletter
                  </h2>
                  <p className="text-gray-600 text-subtitle3 md:text-subtitle2 lg:text-subtitle1 font-garet">
                    Get case studies and event updates delivered straight to your inbox.
                  </p>
                </div>
                <div className="flex text-black flex-row gap-4 items-center md:min-w-[300px] ml-auto px-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 min-h-[30px] border-gray-300"
                  />
                  <button
                    onClick={() => handleRegister(email)}
                    disabled={loading}
                    className={`px-8 text-white bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99] font-semibold py-2 px-6 rounded-lg shadow-lg hover:scale-105 transform transition duration-300 ${
                      loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="transform translate-y-[-80px] md:translate-y-[-0px]">
            <div className="">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="space-y-1">
                  <h1 className="text-xl md:text-4xl font-bold">Cp Cheats</h1>
                  <address className="text-sm md:text-lg not-italic text-gray-100 max-w-sm mx-auto mt-4 ">
                    Created by: Pawan Kumar
                    <br />
                    National Institute of Technology, Agartala
                  </address>
                  <div className="mt-6">
                    <ul className="flex gap-x-4 justify-center">
                      {links.map((link) => (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-gray-200 transition-colors inline-block"
                            aria-label={link.label}
                          >
                            {React.cloneElement(link.icon, {})}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center text-sm sm:text-lg sm:pt-6 px-4">&copy; Cp Cheats</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
