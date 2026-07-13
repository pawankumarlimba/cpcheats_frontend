'use client';
import { LogOut,DeleteIcon, UserCog, LockKeyholeOpen, MailSearch, ArrowUpRight, Repeat } from "lucide-react"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "../drawer/drawer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Changename from "../name-change/name-change";
import { Dialog, DialogContent, DialogTitle,} from "@/components/ui/dialog";
import EmailFlow from "../profile-email-change/otp-flow";
import PasswordFlow from "../profile-password-change-flow/otp-flow";


interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void | Promise<void>; 
}


interface CartDrawerProps {
  isOpen: boolean;
  name:string;
  username:string;
  email:string;
  handleLogout: () => Promise<void>;
  setIsOpen: (isOpen: boolean) => void;
}

export default function CartDrawer({
  isOpen,
  name,
  username,
  email,
  setIsOpen,
  handleLogout
}: CartDrawerProps) {
  
 const [isDrawerOpen1, setIsDrawerOpen1] = useState(false);
 const [isDrawerOpen2, setIsDrawerOpen2] = useState(false);
 const [isDrawerOpen3, setIsDrawerOpen3] = useState(false);

    const menuItems: MenuItem[] = [
      {
        label: "Change Name",
        icon: <UserCog className="w-4 h-4" />,
        onClick: async () => {
          setIsDrawerOpen1(true);
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Example async operation
        },
      },
      {
        label: "Change Email",
        icon: <MailSearch className="w-4 h-4" />,
        onClick: async () => {
          setIsDrawerOpen2(true);
          console.log("Opening Terms & Policies...");
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Example async operation
        },
      },
      {
        label: "Change Password",
        icon: <LockKeyholeOpen className="w-4 h-4" />,
        onClick: async () => {
          setIsDrawerOpen3(true);
          console.log("Opening Terms & Policies...");
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Example async operation
        },
      },
      {
        label: "Progress",
        icon: <ArrowUpRight className="w-4 h-4" />,
        onClick: async () => {
          window.location.replace(`/profile/${username}`);
          await new Promise((resolve) => setTimeout(resolve, 500)); // Example async operation
        },
      },
      {
        label: "Compare with friends",
        icon: <Repeat className="w-4 h-4" />,
        onClick: async () => {
          window.location.replace(`/compare`);
          await new Promise((resolve) => setTimeout(resolve, 500)); // Example async operation
        },
      }
      
    ];
  const openDrawer = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  const closeDrawer = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(false);
  };

  const getColorFromString = (str:string) => {
    const colors = [
      "#F44336", "#E91E63", "#9C27B0", "#673AB7",
      "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4",
      "#009688", "#4CAF50", "#8BC34A", "#CDDC39",
      "#FFC107", "#FF9800", "#FF5722", "#795548",
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <button style={{ display: "none" }} onClick={openDrawer} />
      </DrawerTrigger>
      <DrawerContent className="flex flex-col">
        <div className="mx-auto md:ml-auto w-full md:w-[400px] flex flex-col  mb-8 sm:mt-8">
        <div className="w-full max-w-sm mx-auto px-8">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <DrawerHeader className="flex justify-between items-center text-[50px]">
  <div className="flex-1 text-center">
    <DrawerTitle>Profile</DrawerTitle>
  </div>
  <DrawerClose asChild>
    <Button className="ml-auto" onClick={closeDrawer}>
      <DeleteIcon />
    </Button>
  </DrawerClose>
</DrawerHeader>
        <div className="relative px-6 pt-4 pb-6">
          <div className="flex items-center gap-4 ">
            <div className="relative shrink-0">
            <div
  className={`rounded-full w-[72px] h-[72px] text-[50px] text-white flex items-center justify-center ring-4 ring-white`}
  style={{ backgroundColor: getColorFromString(name) }}
>
  {name.charAt(0).toUpperCase()}
</div>

              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 whitespace-normal break-words">{username}</h2>
              <p className="text-zinc-600 dark:text-zinc-400 w-44 break-words">{email}</p>
            </div>
          </div>
          <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-6" />
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
              onClick={() => item.onClick()}
                key={item.label}
                className="flex items-center justify-between p-2 
                                    hover:bg-zinc-50 dark:hover:bg-zinc-800/50 
                                    rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{item.label}</span>
                </div>
             
              </button>
            ))}

            <button
              onClick={handleLogout}
              type="button"
              className="w-full flex items-center justify-between p-2 
                                hover:bg-zinc-50 dark:hover:bg-zinc-800/50 
                                rounded-lg transition-colors duration-200"
            >
              <div className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Logout</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>  
        </div>
      </DrawerContent>
      <Dialog open={isDrawerOpen1} onOpenChange={setIsDrawerOpen1}>
        <DialogContent className="max-w-[350px] md:max-w-[400px] rounded-2xl">
          <DialogTitle>
            <Changename email={email} />
          </DialogTitle>
        </DialogContent>
      </Dialog>
      <Dialog open={isDrawerOpen3} onOpenChange={setIsDrawerOpen3}>
        <DialogContent className="max-w-[350px] md:max-w-[400px] rounded-2xl">
          <DialogTitle>
            <PasswordFlow email={email } />
          </DialogTitle>
        </DialogContent>
      </Dialog>
      <Dialog open={isDrawerOpen2} onOpenChange={setIsDrawerOpen2}>
        <DialogContent className="max-w-[350px] md:max-w-[400px] rounded-2xl">
          <DialogTitle>
            <EmailFlow email={email } />
          </DialogTitle>
        </DialogContent>
      </Dialog>
    </Drawer>
    
  );
}
