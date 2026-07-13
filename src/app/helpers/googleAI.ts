import axios from "axios";

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const API_KEY = process.env.GOOGLE_API_KEY;

// System prompt to guide the AI's behavior for DSA
const SYSTEM_PROMPT = `
You are an AI assistant for a Data Structures and Algorithms (DSA) project that name is cp cheats and founder is pawan kumar. Your role is to help users with all aspects of DSA, including:
1. **Cheatsheets**: Provide quick references for algorithms and data structures.
2. **Contest Help**: Provide ready-to-use algorithms during coding contests.
3. **Visualizations**: Explain algorithms with visual examples.
4. **Interview Preparation**: Analyze company-specific DSA questions year-wise and topic-wise.
5. **Progress Tracking**: Help users track their progress sheet-wise and topic-wise.
6. **Coding Questions**: Break down coding questions into steps and explain how to solve them.
7. **General Guidance**: Answer questions like "How to start DSA?" or "How to prepare for coding interviews?"

If a question is unrelated to DSA, respond with: "I can only assist with Data Structures and Algorithms (DSA). Please ask a question related to DSA."

Here are some examples of questions you can answer:
1. How do I implement Dijkstra's algorithm?
2. Can you show me a visualization of BFS?
3. What are the most frequently asked DSA questions by Google?
4. How do I solve the 'Two Sum' problem?
5. How do I track my progress in DSA?
6. How do I start learning DSA?
`;

export const generateContent = async (userPrompt: string) => {
  try {
    // Combine the system prompt with the user's input
    const fullPrompt = `${SYSTEM_PROMPT}\n\nUser: ${userPrompt}`;

    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: fullPrompt }]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Extract the generated content
    const generatedContent = response.data.candidates[0]?.content?.parts[0]?.text || "No response generated.";

    // Validate if the response is related to DSA
    if (!isDSARelated(generatedContent)) {
      return "I can only assist with Data Structures and Algorithms (DSA). Please ask a question related to DSA.";
    }

    return generatedContent;
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content.");
  }
};

// Helper function to validate if the response is DSA-related
const isDSARelated = (response: string): boolean => {
  const dsaKeywords = [
    "data structures", "algorithms", "array", "linked list", "tree", "graph", 
    "sorting", "searching", "time complexity", "space complexity", "binary search", 
    "quicksort", "mergesort", "Dijkstra", "BFS", "DFS", "stack", "queue", 
    "hash table", "dynamic programming", "recursion", "backtracking", "contest", 
    "interview", "coding question", "progress tracking", "cheatsheet", "visualization"
  ]; 
  return dsaKeywords.some(keyword => response.toLowerCase().includes(keyword.toLowerCase()));
};