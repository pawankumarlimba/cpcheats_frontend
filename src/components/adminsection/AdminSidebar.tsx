'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CheckCheck, Mail, Power } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'


interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}
interface NavItem1 {
  title: string
  icon: React.ElementType
}


const mainNavItems: NavItem[] = [
  { title: 'Verify', href: '/admin-varify', icon: CheckCheck },
  { title: 'Newsletter', href: '/admin-newsletters', icon: Mail },
]
const mainNavItemsbottom: NavItem1[] = [
  { title: 'Logout', icon: Power },
 
]

export default function Sidebar() {
  const pathname = usePathname()
  const handleLogout = () => {
    localStorage.removeItem('token');
   
    window.location.replace('/admin-varify');
  };



  return (
    <aside
      className={cn(
        'fixed inset-y-0 z-30 overflow-y-auto bg-white border-r shadow-md transition-transform duration-200 ease-in-out',
        'w-[70px] md:w-[100px] lg:w-[200px] p-4'
      )}
    >
      <nav className="flex flex-col space-y-3 mt-[80px]">
        {mainNavItems.map(({ title, href, icon: Icon }) => {
          const isActive = pathname.endsWith(href) // ✅ Fixed isActive condition

          return (
            <Link
              key={title}
              href={href} // ✅ Use href directly
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                'hover:bg-[#707FDD]/20 hover:text-[#707FDD]',
                isActive && 'bg-[#707FDD]/20 text-[#707FDD]'
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="hidden lg:block">{title}</span>
            </Link>
          )
        })}
      
      <div className="fixed  bottom-4 left-0 right-0  space-y-1 px-4">
      {mainNavItemsbottom.map(({ title, icon: Icon }) => {
 

          return (
            <Button
            onClick={handleLogout}
              key={title}
              className={cn(
                'flex bg-reansparent text-start text-black lg:w-[166px] items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
                'hover:bg-[#707FDD]/20 hover:text-[#707FDD]',
              
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="hidden lg:block">{title}</span>
            </Button>
          )
        })}
            </div>

      </nav>
    </aside>
  )
}
