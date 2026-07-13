"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative isolate overflow-hidden bg-white pt-[50px] ">
      <div className="mx-auto container-fluid px-8 py-20 grid sm:grid-cols-2 min-h-[400px]  gap-x-6">
        <div className=" md:flex-shrink-0 flex flex-col md:justify-center">
          <motion.h1
            className="text-3xl font-bold tracking-tight text-black lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Master Competitive Programming with{" "}
            <span className="bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99] bg-clip-text text-transparent">
              CP Cheats
            </span>
          </motion.h1>
          <motion.p
            className="mt-6 sm:mt-4 text-lg leading-6 text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Explore CP Cheats—your go-to platform for coding. Access company-wise interview discussions, run multi-language code, and visualize algorithms in real time. Ace coding competitions and technical interviews effortlessly!
          </motion.p>
  
        </div>
        <motion.div
          className="  mt-16 sm:mt-0"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="relative w-full">
          <Image
  src="/img/herosection.webp"
  alt="CP Cheats Dashboard Preview"
  priority 
              width={600}
              height={600}
              className="w-[500px] rounded-2xl shadow-xl ring-1 ring-gray-900/10"
            />



          </div>
        </motion.div>
      </div>
    </div>
  );
}
