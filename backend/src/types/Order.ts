import mongoose from "mongoose";

export interface OrderItem {
  product_name: string;
  quantity: number;
  price_per_unit: number;
}

export interface Order {
  customer_name: string;
  address: string;
  order_date: Date;
  items: OrderItem[];
}

export interface OrderDoc extends Order, mongoose.Document {}
