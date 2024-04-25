import mongoose from "mongoose";
import type { OrderItem, OrderDoc } from "./types";

const itemSchema = new mongoose.Schema<OrderItem>({
  product_name: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  price_per_unit: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema<OrderDoc>({
  customer_name: { type: String, required: true },
  address: { type: String, required: true },
  order_date: { type: Date, default: Date.now },
  items: [itemSchema],
});

const Order = mongoose.model<OrderDoc>("Order", orderSchema);

export { Order };
