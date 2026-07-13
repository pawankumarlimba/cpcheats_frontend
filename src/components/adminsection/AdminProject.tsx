import React from "react";
import {  Loader2, Mail  } from 'lucide-react';
import { Users } from "lucide-react";
import { Button } from "../ui/button";


interface ProjectCardProps {
  name: string;
  companyname: string;
  onSend: () => Promise<void>; 
  isLoading: boolean; 
  isEmail: boolean;
  status: boolean | "Notvarified" | "Varified";
}


const statusColors: Record<string, string> = {
  Notvarified: "bg-yellow-100 text-yellow-700 border-yellow-300",
  Varified: "bg-green-100 text-green-700 border-green-300",
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  name,
  onSend,
  companyname,
  isLoading,
  isEmail,
  status
}) => {
  const statusText = status === true ? "Varified" : status === false ? "Notvarified" : status;
  return (
    <div className="border border-gray-300 rounded-lg p-4 shadow-sm w-[220px]">
      {/* Icon */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-md">
          { <Users size={20} />}
        </div>
        <div
          className={`text-sm font-medium px-2 py-1 border rounded-full ml-auto ${
            statusColors[statusText] || "bg-gray-100 text-gray-700 border-gray-300"
          }`}
        >
          {statusText}
        </div>
      </div>

      {/* Project Details */}
      <h2 className="text-lg font-semibold">{name}</h2>
      <div className="text-gray-500 text-sm mt-1">
        <p className="flex gap-2 items-center py-1">Company : {companyname}</p>
        <Button
          className="flex gap-2 bg-white border-black hover:bg-white text-black items-center py-1"
          onClick={onSend}
          disabled={isLoading || isEmail} 
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Mail />}
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
};

export default ProjectCard;
