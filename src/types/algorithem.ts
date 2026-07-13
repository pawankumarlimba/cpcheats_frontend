export type AlgorithmCardProps = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  use: string;
  user:string;
  code: Record<string, string>;
  execute: string;
};
