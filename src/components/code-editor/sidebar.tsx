"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { DiPython, DiJavascript, DiJava } from "react-icons/di"
import { SiC, SiCplusplus, SiRuby } from "react-icons/si"
import { CodeXml } from "lucide-react"

import { cn } from "@/lib/utils"
import { LANGUAGES, type Language } from "./types"

interface NavItem {
  title: Language
  icon: React.ElementType
}

const mainNavItems: NavItem[] = [
  { title: "Python", icon: DiPython },
  { title: "C", icon: SiC },
  { title: "Ruby", icon: SiRuby },
  { title: "Javascript", icon: DiJavascript },
  { title: "Java", icon: DiJava },
  { title: "Cpp", icon: SiCplusplus },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "fixed inset-y-0 z-30 flex flex-col overflow-y-auto hide-scrollbar",
        "bg-white border-r border-slate-200 shadow-[1px_0_0_0_rgba(0,0,0,0.02)]",
        "w-[70px] md:w-[100px] lg:w-[200px]"
      )}
    >
      {/* Brand mark */}
      <div className="flex items-center justify-center lg:justify-start gap-2 h-[64px] px-0 lg:px-4 border-b border-slate-100 shrink-0">
        <div className="h-8 w-8 rounded-lg bg-[#707FDD]/10 flex items-center justify-center shrink-0">
          <CodeXml className="h-4 w-4 text-[#707FDD]" />
        </div>
        <span className="hidden lg:block text-sm font-semibold tracking-tight text-slate-800">
          Code Editor
        </span>
      </div>

      <nav className="flex flex-col gap-1 mt-4 px-2 lg:px-3">
        <span className="hidden lg:block px-2 pb-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">
          Languages
        </span>
        {mainNavItems.map(({ title, icon: Icon }) => {
          const meta = LANGUAGES[title]
          const isActive = pathname.endsWith(`/${title}`)

          return (
            <Link
              key={title}
              href={`${title}`}
              title={meta.label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150",
                "justify-center lg:justify-start",
                isActive
                  ? "text-slate-900"
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
              )}
              style={isActive ? { backgroundColor: meta.colorSoft } : undefined}
            >
              <span
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full transition-opacity",
                  isActive ? "opacity-100" : "opacity-0"
                )}
                style={{ backgroundColor: meta.color }}
              />
              <Icon
                className="h-5 w-5 shrink-0"
                style={{ color: isActive ? meta.color : undefined }}
              />
              <span className="hidden lg:block font-medium">{meta.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}