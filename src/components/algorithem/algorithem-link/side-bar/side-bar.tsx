"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import axios from "axios";

interface NavItem {
  name: string;
  slug: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const fetchNavItems = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.post("/api/algorithm/algorithm-sidebar");
        setNavItems(response.data);
      } catch (error) {
        console.error("Error fetching navigation items:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchNavItems();
  }, []);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 z-30 overflow-y-auto hide-scrollbar bg-white  border-r shadow-md transition-transform duration-200 ease-in-out  ",
        "hidden md:block md:w-[150px] lg:w-[250px] p-4"
      )}
    >
      <nav className="flex flex-col space-y-3 mt-[80px]">
        {loading ? (
        
          <div className="flex justify-center items-center h-full">
            <div className="w-6 h-6 border-4 border-[#707FDD] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          
          navItems.map(({ name, slug }) => {
            const isActive = pathname === `/algorithem/${slug}`;
            return (
              <Link
                key={slug}
                href={`/algorithem/${slug}`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                  "hover:bg-[#707FDD]/20 hover:text-[#707FDD]",
                  isActive && "bg-[#707FDD]/20 text-[#707FDD]"
                )}
              >
                <span className="hidden md:block">{name}</span>
              </Link>
            );
          })
        )}
      </nav>
    </aside>
  );
}
