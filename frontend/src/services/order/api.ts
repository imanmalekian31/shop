import type { Order, OrderDoc } from "../../../../backend/src/types";
import axios from "../axios";

export const getOrders = async (params: object) => {
  const { data } = await axios.get("/orders", { params });
  return data;
};

export const getOrder = async <T = OrderDoc>(id: string): Promise<T> => {
  const { data } = await axios.get<T>(`/orders/${id}`);
  return data;
};

export const createOrder = async (payload: Order) => {
  const { data } = await axios.post("/orders", payload);
  return data;
};

export const updateOrder = async (id: string, payload: Order) => {
  const { data } = await axios.patch(`/orders/${id}`, payload);
  return data;
};

export const deleteOrder = async (id: string) => {
  const { data } = await axios.delete(`/orders/${id}`);
  return data;
};
