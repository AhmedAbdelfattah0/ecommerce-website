 export interface CreateOrderRequest {
  name: string;
  phoneNumber: string;
  address: string;
  state: string;
  statusId: number;
  date: string;
  email: string;
  products: {
    productId: number;
    qty: number;
  }[];
}
