import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowUpRight, Check, Clipboard, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import Link from "next/link";

export const CaseCard = ({
  item, 
}: {
  item: {
    _id: string;
    name: string;
    slug:string;
    description: string;
    timeComplexity: string;
    spaceComplexity: string;
    use: string;
    user:string;
    code: Record<string, string>;
    execute: (input: string, setOutput: React.Dispatch<React.SetStateAction<string>>) => Promise<void>;
    bgColor: string;
  };
  className?: string;
}) => {
  const [userInput, setUserInput] = useState(item.use);
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState<string>("cpp");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const runCode = async () => {
    setLoading(true);
    setOutput(""); // Clear previous output
  
    try {
      if (typeof item.execute === "string") {
        // Create the function dynamically
        const executeFunction = new Function("input", "setOutput", `
          ${item.execute}
          return start(input, setOutput);
        `);
        
        console.log("executeFunction created successfully");
  
        // Ensure input is formatted correctly
        const userInputString = userInput; // Ensure it's a string
  
        console.log("User Input String:", userInputString);
  
        // Execute function and await result
        const result = await executeFunction(userInputString, setOutput);
        console.log("Execution result:", result);
  
        // If function returns something, update the output
        if (result !== undefined) {
          setOutput((prev) => prev + `\nFinal Output: ${result}`);
        }
      } else {
        setOutput("Error: Invalid function.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setOutput(`Error executing code: ${err.message}`);
      } else {
        setOutput("Error executing code.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  const handleCopy = () => {
    setCopyLoading(true);
    navigator.clipboard
      .writeText(item.code[language])
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
          setCopyLoading(false);
        }, 2000);
      })
      .catch(() => {
        setCopyLoading(false);
      });
  };

  return (
    <Card bgColor={item.bgColor}>
      <div className="p-6 h-[500px] flex flex-col justify-between overflow-y-auto relative">
        {isFlipped ? (
          <div className="space-y-4 mt-4">
           <h4 className="text-xl font-bold">Time Complexity: <span className="ttext-[18px] font-medium">{item.timeComplexity}</span></h4>
            <h4 className="text-xl font-bold">Space Complexity: <span className="text-[18px] font-medium">{item.spaceComplexity}</span></h4>
            <p className="text-sm" >{item.user}</p>
            <div className='flex gap-4 items-center justify-between sticky bottom-0 left-0'>
            <Input
              type="text"
              placeholder={item.use}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
                  <Button onClick={runCode} className="text-white flex gap-1 items-center shadow-lg bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99] rounded-md border px-4 py-2 text-sm" disabled={loading}>
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Execute"}
            </Button>
                </div>
           

            

            {output && (
              <div className="mt-4 p-3 bg-gray-100 rounded ">
                <h3 className="font-semibold">Working And Output:</h3>
                <div className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                <div className=" overflow-x-auto overflow-y-auto max-h-[165px] scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
                dangerouslySetInnerHTML={{ __html: output }} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center">
              <CardTitle>{item.name}</CardTitle>
              <Select onValueChange={setLanguage} defaultValue="cpp">
                <SelectTrigger className="w-[100px] ml-auto">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(item.code).map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <CardHeading>{item.description}</CardHeading>

            <div className="mt-4 relative overflow-y-auto">
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto overflow-y-auto max-h-[320px] scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
                <CardDescription>
                  <code>{item.code[language]}</code>
                </CardDescription>
              </pre>

              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleCopy}
                disabled={copyLoading}
              >
                {copyLoading ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Clipboard className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      
        <div className='flex gap-4 items-center justify-between sticky bottom-0 left-0'>
        <Button onClick={() => setIsFlipped(!isFlipped)} className=" text-white flex gap-1 items-center shadow-lg bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99] rounded-md border px-4 py-2 text-sm ">
          {isFlipped ? "Hide Input" : "Show Input"}
        </Button>
                  <Link href={`/algorithem-details/${item.slug}`} className="text-[#666666] p-1 hover:bg-[#C7C6C6] rounded-md">
                  <ArrowUpRight size={30} />
                  </Link>
                </div>
      </div>
    </Card>
  );
};

export const Card = ({ className, children, bgColor }: { className?: string; children: React.ReactNode; bgColor: string }) => {
  return <div className={cn("rounded-tr-2xl rounded-bl-xl h-full w-full overflow-hidden relative z-20", bgColor, className)}>{children}</div>;
};

export const CardTitle = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <h4 className={cn("text-[#030712] text-start text-[17.58px] font-bold tracking-wide mt-1 ml-4", className)}>{children}</h4>;
};

export const CardHeading = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <h4 className={cn("text-[#030712] text-start text-[15px] font-medium tracking-wide mt-1 ml-4", className)}>{children}</h4>;
};

export const CardDescription = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <h4 className={cn("text-[#030712] text-start text-[12px] tracking-wide mt-1 ml-4", className)}>{children}</h4>;
};
