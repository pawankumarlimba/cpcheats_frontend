export interface Store  {
    id: number;
    src: string;
    title: string;
    heading: string;
    rating: number;
    price: number;
    originalPrice: number;
    discount: string;
    category: string;
    details: string[];
    reviews: {
      userRating: number;
      userName: string;
      description: string;
      date: string;
    }[];
    productsUsed: {
      id:number;
      src: string;
      companyName: string;
      productName: string;
    }[];
    reviewCounts: number[];
    reletedproduct: number[];
  };
  