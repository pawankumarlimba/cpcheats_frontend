"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import CartDrawer from "@/components/profile/cart-drawer/cart-drawer";

interface IUser {
  username: string;
  name: string;
  email: string;
  accessToken: string;
}

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setuser] = useState<IUser | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null); 
  const buttonRef = useRef<HTMLButtonElement | null>(null); 

  const handleOutsideClick = (e: Event) => {
    const target = e.target as Node;

    if (
      menuRef.current && 
      !menuRef.current.contains(target) && 
      !buttonRef.current?.contains(target)
    ) {
      setIsOpen(false);
    }
  };

  const handleCloseClick = () => {
    setIsOpen(false);
  };

  const menuVariants = {
    closed: { y: "-100%", opacity: 0 },
    open: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeInOut" as const },
    },
  };

  const LinkWithHover = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <Link href={href} className="relative group">
      <span className="text-[15px] text-black font-medium relative tracking-[0.6px] leading-[20px]">
        {children}
        <motion.span
          className="absolute left-0 bottom-0 h-[2px] bg-black"
          initial={{ width: 0 }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </span>
    </Link>
  );



  const getCookie = (name: string): string | null => {
    if (typeof window === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  useEffect(() => {
    const logintoken = getCookie('token1');
    if (logintoken) {
      //console.log(logintoken)
      finduser(logintoken);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    const handleClickOutside = (e: Event) => handleOutsideClick(e);

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const finduser = async (accessToken: string) => {
    try {
      const response = await axios.post("/api/client/finduser", { accessToken });
      //console.log(response.data.user); 
      if (response.data.success) {
        setuser(response.data.user); 
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
  const openDrawer = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation(); 
    setIsDrawerOpen(true);
  };

  const handleLogout = async () => {
    document.cookie = "token1=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    setuser(null);
    window.location.replace('/');
  };
  return (
    <header className="w-full bg-background py-4 absolute z-50 border-b shadow-md">
      <div className="container-fluid mx-auto">
        <div className="flex justify-between items-center">
          <nav className="hidden lg:flex items-center gap-6 text-lg">
            <LinkWithHover href="/">Home</LinkWithHover>
            <LinkWithHover href="/algorithem/binary-search">Algorithm</LinkWithHover>
            <LinkWithHover href="/interview">Interview Experience</LinkWithHover>
            <LinkWithHover href="/live-interview">Mock Interview</LinkWithHover>
            <LinkWithHover href="/code-editor/C">Code Editor</LinkWithHover>
            <LinkWithHover href="/interview-analyzer/google">Interview Analyzer</LinkWithHover>
            <LinkWithHover href="/coding-sheets">Coding Sheets</LinkWithHover>
            <LinkWithHover href="/feedback">Feedback</LinkWithHover>
          </nav>
          <div className="hidden lg:flex items-center space-x-4">
          {isLoggedIn ? (
        <Button  className="shadow-xl  bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99]" onClick={(e) => openDrawer(e)}>
            <p>{user?.name.charAt(0).toUpperCase() || " "}</p>
          </Button>
         ) : (
         <>
         <Button className="shadow-lg" variant="outline" size="sm">
          <Link href="/login" className="text-base text-grey font-semibold leading-[24px]">Login</Link>
           </Button>
         <Button className="shadow-lg bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99]" size="lg">
        <Link href="/sign-up" className="text-base text-white font-bold relative tracking-[0.6px] leading-[20px] flex items-center gap-2">
        Sign up
        {/* <ArrowRight className="h-4 w-4" /> */}
          </Link>
           </Button>
           </>
           )}
          </div>
          <Button
            ref={buttonRef}
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" onClick={handleCloseClick} /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            className="fixed z-50 inset-x-0 mx-2 border rounded-lg top-[80px] bg-background shadow-lg lg:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <nav onClick={handleCloseClick} className="flex flex-col space-y-4 p-4 ">
              <LinkWithHover  href="/">Home</LinkWithHover>
              <LinkWithHover href="/algorithem/binary-search">Algorithm</LinkWithHover>
              <LinkWithHover href="/interview">Interview Experience</LinkWithHover>
              <LinkWithHover href="/live-interview">Mock Interview</LinkWithHover>
              <LinkWithHover href="/code-editor/C">Code Editor</LinkWithHover>
              <LinkWithHover href="/interview-analyzer/google">Interview Analyzer</LinkWithHover>
              <LinkWithHover href="/coding-sheets">Coding Sheets</LinkWithHover>
              <LinkWithHover href="/feedback">Feedback</LinkWithHover>
              <div className="">
              {isLoggedIn ? (
        <div >
         <Button  className="shadow-xl bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99]" onClick={(e) => openDrawer(e)}>Profile</Button> 
          </div>
         ) : (
          <div className="pt-4  space-x-2">
                <Button className="shadow-lg bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99]" onClick={() => setIsOpen(false)}>
                  <Link href="/sign-up">Register</Link>
                </Button>
                <Button className="shadow-lg" variant="outline" onClick={() => setIsOpen(false)}>
                  <Link href="/login">Login</Link>
                </Button>
                </div>
         )}
              </div>
            </nav>

          </motion.div>
        )}
      </AnimatePresence>
      <CartDrawer
       handleLogout={handleLogout}
         name={user?.name || ""}
         username={user?.username || ""}
         email={user?.email || ""}
        isOpen={isDrawerOpen}
        setIsOpen={setIsDrawerOpen}
      />
    </header>
  );
};

export default Header;
