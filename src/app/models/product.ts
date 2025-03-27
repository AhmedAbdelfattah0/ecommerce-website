export interface Product {
  id: number;
  title: string;
  titleAr:string;
  discountedPrice: string;
  description: string;
  imgOne: string;
  imgTwo: string;
  imgThree: string;
  imgFour: string;
  videoLink: string;
  categoryId: string;
  subCategoryId: number;
  // stock: number;
  rating: number;
  isNew?: boolean;
  discount: number;
  originalPrice: string;
  reviews?: number;
  badge?:string;
  subtitle?:string;
  availability:string;
  qty:number;
  categoryName:string;
}
export interface Product_v2 {
  id: number;
  title: string;
  titleAr:string;
  discountedPrice: string;
  description: string;
  images: Array<string>;
  videoLink: string;
  categoryId: string;
  subCategoryId: number;
  categoryName:string;
  // stock: number;
  rating: number;
  isNew?: boolean;
  discount: number;
  originalPrice: string;
  reviews?: number;
  badge?:string;
  subtitle?:string;
  availability:string;
}

export interface ProductsResponse{
  total:number;
  products:Product[]
}
