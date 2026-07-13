export type Language = "Javascript" | "Python" | "Java" | "Cpp" | "Ruby" | "C"

export interface LanguageMeta {
    label: string
    monacoId: string
    judge0Id: number
    extension: string
    color: string
    colorSoft: string
}

export const LANGUAGES: Record<Language, LanguageMeta> = {
    Python: {
        label: "Python",
        monacoId: "python",
        judge0Id: 71,
        extension: "py",
        color: "#4B8BBE",
        colorSoft: "rgba(75,139,190,0.16)",
    },
    C: {
        label: "C",
        monacoId: "c",
        judge0Id: 50,
        extension: "c",
        color: "#5C6BC0",
        colorSoft: "rgba(92,107,192,0.16)",
    },
    Ruby: {
        label: "Ruby",
        monacoId: "ruby",
        judge0Id: 72,
        extension: "rb",
        color: "#CC342D",
        colorSoft: "rgba(204,52,45,0.16)",
    },
    Javascript: {
        label: "JavaScript",
        monacoId: "javascript",
        judge0Id: 63,
        extension: "js",
        color: "#F0DB4F",
        colorSoft: "rgba(240,219,79,0.16)",
    },
    Java: {
        label: "Java",
        monacoId: "java",
        judge0Id: 62,
        extension: "java",
        color: "#E76F00",
        colorSoft: "rgba(231,111,0,0.16)",
    },
    Cpp: {
        label: "C++",
        monacoId: "cpp",
        judge0Id: 54,
        extension: "cpp",
        color: "#00599C",
        colorSoft: "rgba(0,89,156,0.16)",
    },
}

// A tiny starter snippet per language so the editor never opens on a blank,
// intimidating void — this is one of the biggest first-run UX wins for a
// code playground.
export const DEFAULT_SNIPPETS: Record<Language, string> = {
    Python: `def solve():\n    # write your solution here\n    pass\n\n\nif __name__ == "__main__":\n    solve()\n`,
    C: `#include <stdio.h>\n\nint main(void) {\n    // write your solution here\n    printf("Hello, world!\\n");\n    return 0;\n}\n`,
    Cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    // write your solution here\n    cout << "Hello, world!" << endl;\n    return 0;\n}\n`,
    Java: `public class Main {\n    public static void main(String[] args) {\n        // write your solution here\n        System.out.println("Hello, world!");\n    }\n}\n`,
    Javascript: `function solve() {\n  // write your solution here\n  console.log("Hello, world!");\n}\n\nsolve();\n`,
    Ruby: `def solve\n  # write your solution here\n  puts "Hello, world!"\nend\n\nsolve\n`,
}