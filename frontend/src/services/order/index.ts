export * from "./api";

import { Pagination } from "./../../types/Pagination";
import { useQuery, useMutation } from "@tanstack/react-query";
import * as api from "./api";
import type { OrderDoc, Order } from "../../../../backend/src/types";
import type { AxiosError } from "axios";

export const useGetOrders = (limit: number, offset: number) => {
  return useQuery<Pagination<OrderDoc>, AxiosError>({
    queryKey: ["orders-list", offset, limit],
    queryFn: () => api.getOrders({ limit, offset }),
  });
};

export const useGetOrder = (id: string) => {
  return useQuery<OrderDoc, AxiosError>({
    queryKey: ["order", id],
    queryFn: () => api.getOrder(id),
    retry: false,
  });
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: (payload: Order) => api.createOrder(payload),
  });
};

export const useUpdateOrder = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Order }) =>
      api.updateOrder(id, payload),
  });
};

export const useDeleteOrder = () => {
  return useMutation({
    mutationFn: (id: string) => api.deleteOrder(id),
  });
};
