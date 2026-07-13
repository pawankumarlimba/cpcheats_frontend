interface TopicProps {
    name: string
    count: number
  }
  
  export default function TopicsCovered() {
    const topics: TopicProps[] = [
      { name: "Arrays", count: 93 },
      { name: "Linked List", count: 33 },
      { name: "Binary Tree", count: 31 },
      { name: "Graph", count: 24 },
      { name: "Recursion", count: 22 },
      { name: "Binary Search", count: 19 },
      { name: "Hashing", count: 19 },
      { name: "String", count: 18 },
      { name: "Two Pointer", count: 15 },
      { name: "Binary Search Tree", count: 13 },
      { name: "Dynamic Programming", count: 13 },
      { name: "Sorting", count: 12 },
      { name: "Stack", count: 12 },
      { name: "Heap", count: 4 },
      { name: "Maths", count: 4 },
      { name: "Greedy", count: 3 },
      { name: "Queue", count: 2 },
      { name: "Bit Manipulation", count: 0 },
      { name: "Python", count: 0 },
      { name: "Sliding Window", count: 0 },
    ]
  
    return (
      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Topics Covered (on takeUforward)</h2>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {topics.map((topic) => (
            <div
              key={topic.name}
              className="border rounded-lg p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-800">{topic.name}</span>
              <span className="text-gray-500">x{topic.count}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  