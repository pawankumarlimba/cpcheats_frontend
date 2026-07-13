import React from "react";
import LearningProgress from "../learning-progress/learning-progress";

interface Params {
  slug: string;
}
export default function Sheets({ params }: { params: Promise<Params> }) {
   const { slug } = React.use(params);
    return (
      <main className="min-h-screen bg-gray-50 pt-[80px]">
        <LearningProgress slug={slug} />
      </main>
    )
  }