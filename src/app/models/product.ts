export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  // stock: number;
  rating: number;
  isNew?: boolean;
  discount?: number;
  originalPrice?: number;
  reviews?: number;
  badge?:string;
}

export interface ProductsResponse{
  total:number;
  products:Product[]
}
