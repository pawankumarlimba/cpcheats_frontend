"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {  useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"
import PasswordFlow from '@/components/otp/otp-flow';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"


export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [Password, setPassword] = useState<string>("");
  const [email, setemail] = useState<string>("");
  const [Lodaing,setLoading]=useState<boolean>(false)
  const handleLogin = async () => {
    if(!email || !Password) {
      toast.error("Email and Password are required");
     return;
    }
    if (Password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    setLoading(true);
    try {
      const deviceInfo = navigator.userAgent;
      const response = await axios.post('/api/client/login', {
        email,
        Password,
        deviceInfo,
      });
     
      if (response.data.success) {
        const token = response.data.user.accessToken;
        const maxAge = 10 * 24 * 60 * 60; // 10 days
        document.cookie = `token1=${token}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;
        toast.success(response.data.message);
        window.location.replace('/');
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
      setLoading(false) 
    }
  };
  


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="overflow-hidden  bg-white shadow-xl  transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-3xl">
        <div className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">Crack Every Code – One Login Away!</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email"
                 value={email}
                 onChange={(e) => setemail(e.target.value)}
                 type="email" 
                 placeholder="m@example.com" 
                 required />
              </div>
              <div className="grid gap-2">
              <Label htmlFor="email">Password</Label>
              <div className="relative">
                  <Input
                   id="password"
                    type={showPassword ? "text" : "password"} 
                    value={Password}
                    onChange={(e) => setPassword(e.target.value)}
                    required />
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-sm hover:bg-transparent"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff/> : <Eye/>}
                  </Button>
                </div>
                <Dialog>
        <DialogTrigger asChild>
        <button className='mt-4 text-black hover:border-b-[2px] hover:border-black flex mr-auto  text-[14px]'>
        Forgot passward
        </button>
        </DialogTrigger>
                <DialogContent className="max-w-[350px] md:max-w-[400px] rounded-2xl">
                  
                    <DialogTitle>
                    <PasswordFlow/>
                    </DialogTitle>
                 
                </DialogContent>
              </Dialog>
              </div>
              <Button
              disabled={Lodaing}
              onClick={handleLogin }
              type="submit" className="w-full">
                Login
              </Button>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/sign-up" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
          <div className="relative hidden  bg-muted md:block">
            <Image
              src="/img/Cpcheats.svg"
              alt="Image"
              fill
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

