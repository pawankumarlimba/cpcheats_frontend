import Link from "next/link";

interface TopicProps {
    name: string;
    count: number;
    link:string;
  }
  
  interface TopicsCoveredProps {
    topics: TopicProps[];
  }
  
  export default function TopicsCovered({ topics }: TopicsCoveredProps) {
    return (
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Topics Covered (on Cp Cheats)</h2>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {topics.map((topic) => (
            <div
              key={topic.name}
              className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <Link href={`/algorithem-details${topic.link}`}>
              <span className="font-medium text-gray-800">{topic.name}</span>
              <span className="text-gray-500">x{topic.count}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }