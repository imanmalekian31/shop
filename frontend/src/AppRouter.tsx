import { Route, Routes } from "react-router-dom";
import { OrderFormPage } from "./pages/OrderFormPage";
import { OrdersListPage } from "./pages/OrdersListPage";
import { OrderDetailsPage } from "./pages/OrderDetailsPage";

export function AppRoute() {
  return (
    <Routes>
      <Route path="/" element={<OrdersListPage />} />
      <Route path="/form" element={<OrderFormPage />} />
      <Route path="/details" element={<OrderDetailsPage />} />
    </Routes>
  );
}
