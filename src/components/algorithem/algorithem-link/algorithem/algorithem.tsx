import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Check, Clipboard, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

export const AlgoCard = ({
  item,
}: {
  item: {
    _id: string;
    name: string;
    description: string;
    slug: string;
    timeComplexity: string;
    spaceComplexity: string;
    user: string;
    use: string;
    code: Record<string, string>;
    execute: string; // The backend returns this as a string
  };
  className?: string;
}) => {
  const [userInput, setuserInput] = useState(item.use);
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState<string>("cpp");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const runCode = async () => {
    setLoading(true);
    setOutput(""); // Clear previous output

    try {
      if (typeof item.execute === "string") {
        const executeFunction = new Function(
          "input",
          "setOutput",
          `
        ${item.execute}
        return start(input, setOutput);
      `
        );

        const userInputString = userInput;

        const result = await executeFunction(userInputString, setOutput);

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

  // Reusable "flipped" side (input/output + fullscreen toggle)
  const renderFlippedSide = (isFull: boolean = false) => (
    <div className={cn("space-y-4", isFull ? "h-full flex flex-col" : "mt-4")}>
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-xl font-bold">
            Time Complexity: <span className="text-[18px] font-medium">{item.timeComplexity}</span>
          </h4>
          <h4 className="text-xl font-bold mt-1">
            Space Complexity: <span className="text-[18px] font-medium">{item.spaceComplexity}</span>
          </h4>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsFullscreen(!isFullscreen)}
          title={isFull ? "Exit Fullscreen" : "Fullscreen Mode"}
        >
          {isFull ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      <p className="text-sm">{item.user}</p>

      <div className="flex gap-4 items-center justify-between sticky bottom-0 left-0">
        <Input
          type="text"
          placeholder={item.use}
          value={userInput}
          onChange={(e) => setuserInput(e.target.value)}
        />
        <Button
          onClick={runCode}
          className="text-white flex gap-1 items-center shadow-lg bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99] rounded-md border px-4 py-2 text-sm"
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Execute"}
        </Button>
      </div>

      {output && (
        <div className={cn("mt-4 p-3 bg-gray-100 rounded", isFull && "flex-1 min-h-0 flex flex-col")}>
          <h3 className="font-semibold">Working And Output:</h3>
          <div className="text-sm text-gray-700 whitespace-pre-wrap break-words">
            <div
              className={cn(
                "overflow-x-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200",
                isFull ? "flex-1 max-h-full" : "max-h-[170px]"
              )}
              dangerouslySetInnerHTML={{ __html: output }}
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Card>
        <div className="p-6 h-[500px] flex flex-col justify-between overflow-auto relative bg-gray-100">
          {isFlipped ? (
            renderFlippedSide(false)
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

              <div className="mt-4 relative">
                <pre className="p-4 rounded text-sm overflow-x-auto overflow-y-auto max-h-[320px] scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
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

          <div className="flex gap-4 items-center justify-between sticky bottom-0 left-0">
            <Button
              onClick={() => setIsFlipped(!isFlipped)}
              className="text-white flex gap-1 items-center shadow-lg bg-gradient-to-r from-[#9BA9FBCC] to-[#3F66FB99] rounded-md border px-4 py-2 text-sm"
            >
              {isFlipped ? "Hide Input" : "Show Input"}
            </Button>
            <Link href={`/algorithem-details/${item.slug}`} className="text-[#666666] p-1 hover:bg-[#C7C6C6] rounded-md">
              <ArrowUpRight size={30} />
            </Link>
          </div>
        </div>
      </Card>

      {/* Fullscreen Overlay Mode */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-white p-6 flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <div className="max-w-5xl mx-auto w-full h-full flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-4 shrink-0">
              <div>
                <h3 className="text-xl font-bold text-[#030712]">{item.name}</h3>
                <p className="text-lg text-gray-500 mt-0.5">{item.description}</p>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-auto">{renderFlippedSide(true)}</div>
          </div>
        </div>
      )}
    </>
  );
};

export const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <div className={cn("rounded-tr-2xl rounded-bl-xl h-full w-full overflow-hidden relative z-20", className)}>{children}</div>;
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