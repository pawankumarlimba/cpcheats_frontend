"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import axios from "axios"
import { toast } from "react-toastify"
import Image from "next/image"

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
    const [showPassword, setShowPassword] = useState(false);
    const [Password, setPassword] = useState<string>("");
    const [email, setemail] = useState<string>("");
    const [name, setname] = useState<string>("");
    const [Lodaing,setLoading]=useState<boolean>(false)
    
    const handleLogin = async () => {
      if(!email || !Password || !name) {
        toast.error("Name,Email and Password are required");
       return;
      }
      if (Password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        return;
      }
      setLoading(true);
      try {
        const response = await axios.post('/api/client/signup', {email,Password,name});
        //console.log(response)
        if (response.data.success) {
          //localStorage.setItem('token1', response.data.savedUser.accessToken);
          toast.success(response.data.message);
          window.location.replace('/login');
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
      <div className="overflow-hidden bg-white shadow-xl  transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-3xl">
        <div className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Join CP Cheats</h1>
                <p className="text-balance text-muted-foreground">Level Up Your Skills – One Click to Begin!</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                 value={name}
                 onChange={(e) => setname(e.target.value)}
                id="text" 
                type="text" 
                placeholder="Enter your name...."
                 required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                 value={email}
                 onChange={(e) => setemail(e.target.value)}
                 id="email"
                  type="email"
                   placeholder="m@example.com" 
                   required />
              </div>
              <div className="grid gap-2">
              <Label htmlFor="email">Password</Label>
              <div className="relative">
                  <Input
                   id="password" 
                   value={Password}
                   onChange={(e) => setPassword(e.target.value)}
                   type={showPassword ? "text" : "password"}
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
              </div>
              <Button disabled={Lodaing} onClick={handleLogin} type="submit" className="w-full">
                Sign up
              </Button>
              <div className="text-center text-sm">
              Already have an account? {" "}
                <a href="/login" className="underline underline-offset-4">
                Log in here!
                </a>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
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

