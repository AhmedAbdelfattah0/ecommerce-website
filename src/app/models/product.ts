export interface Product {
  id: number;
  title: string;
  titleAr:string;
  discountedPrice: number;
  description: string;
  imgOne: string;
  categoryId: string;
  // stock: number;
  rating: number;
  isNew?: boolean;
  discount: number;
  originalPrice: number;
  reviews?: number;
  badge?:string;
  subtitle?:string;
}

export interface ProductsResponse{
  total:number;
  products:Product[]
}
