import { cn } from "@/lib/utils";

import { ArrowUpRight } from "lucide-react";

import Link from "next/link";

export const BlogCard = ({
  items,
  className,
}: {
  items: {
    _id: string;
    name: string;
    issee: boolean;
    date: string;
    isemail: boolean;
    companyname: string;
    subdetails: string;
    details: string;
    slug: string;
    bgColor: string;
  }[];
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3",
        className
      )}
    >
      {items.filter(item => item.issee).map((item) => (
        <div
          key={item?.name}
          className="relative group block p-2 h-full w-full"
        >
          <Card bgColor={item.bgColor}>
            <div key={item._id} className="rounded-lg max-w-[350px]  p-4  overflow-hidden ">
              <div className="">

              </div>
              <div className="mt-2">
                <div className='flex gap-4 items-center justify-between'>
                  <div className='flex gap-4 items-center'>
                    <h2 className=" text-md">{item.name}</h2>
                  </div>
                  <Link href={`/interview/${item._id}`} className="text-[#666666] p-1 hover:bg-[#C7C6C6] rounded-md">
                    <ArrowUpRight />
                  </Link>
                </div>
              </div>
              <CardTitle>{item.companyname}</CardTitle>
              <CardDescription className="mr-4">
                {item.details.split("").slice(0, 100).join("")}
                {item.details.split("").length > 100 && " ..."}

              </CardDescription>
              <div>

              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
  bgColor,
}: {
  className?: string;
  children: React.ReactNode;
  bgColor: string;
}) => {
  return (
    <div
      className={cn(
        "rounded-tr-2xl rounded-bl-xl h-full w-full overflow-hidden relative z-20",
        bgColor,
        className
      )}
    >
      <div className="relative z-50">
        <div className="">{children}</div>
      </div>
    </div>
  );
};



export const CardHeading = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4
      className={cn(
        "px-4 text-[#4F46E5] text-start  tracking-wide mt-2",
        className
      )}
    >
      {children}
    </h4>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4
      className={cn(
        "px-4 text-black-100 text-start font-bold tracking-wide whitespace-pre-wrap break-words mt-2",
        className
      )}
    >
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-2 text-[#4B5563] px-4 text-black-400 tracking-wide text-start mb-8  whitespace-pre-wrap break-words leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
