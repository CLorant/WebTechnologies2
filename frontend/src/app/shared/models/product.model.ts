export interface Product {
  _id?: string;
  name: string;
  description: string;
  img: string;
  price: number;
  category: string;
  createdAt?: Date;
}