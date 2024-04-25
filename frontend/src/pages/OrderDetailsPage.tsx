import { useLocation } from "react-router-dom";
import { useGetOrder } from "../services";
import { Loading } from "../components/Loading";
import { OrderDetails } from "../components/order/order-details/OrderDetails";
import { OrderNotFound } from "../components/order/order-details/OrderNotFound";

export function OrderDetailsPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("id") || "undefined";

  const { data, isLoading, isError, error } = useGetOrder(orderId);

  if (isLoading) return <Loading />;
  if (isError) {
    if ([400, 404].includes(error.response?.status || 400)) {
      return <OrderNotFound />;
    } else {
      return <div>Error: {error.message}</div>;
    }
  }
  if (!data) {
    return <OrderNotFound />;
  }

  return <OrderDetails order={data} />;
}
