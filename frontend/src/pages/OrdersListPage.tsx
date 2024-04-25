import { useState } from "react";
import { useGetOrders, useDeleteOrder } from "../services";
import { useNavigate } from "react-router-dom";
import { OrdersList } from "../components/order/OrdersList";
import { Loading } from "../components/Loading";
import { toast } from "sonner";

export function OrdersListPage() {
  const navigation = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const {
    data: orders,
    isError,
    isLoading,
    isFetching,
    refetch,
  } = useGetOrders(pageSize, currentPage * pageSize);

  const deleteMutation = useDeleteOrder();

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      deleteMutation
        .mutateAsync(id)
        .then(() => {
          toast.success("Order deleted successfully");
          refetch();
        })
        .catch(() => {
          toast.error("Failed to delete the order");
        });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col mt-8">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-700">Orders</h1>
        <button
          className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => navigation("/form")}
        >
          + Create New Order
        </button>
      </div>

      {isLoading || isFetching ? (
        <Loading />
      ) : (
        <OrdersList
          orders={orders!}
          pageSize={pageSize}
          currentPage={currentPage}
          handleDelete={handleDelete}
        />
      )}

      <div className="mt-4">
        {orders?.count === 0 && !isLoading && !isFetching && !isError && (
          <div className="text-gray-500 text-center my-4">
            There is no data!
          </div>
        )}
        {isError && (
          <span className="text-red-500 text-center my-4">
            Failed to load data
          </span>
        )}

        <nav
          className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
          aria-label="Pagination"
        >
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{currentPage * pageSize + 1}</span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min((currentPage + 1) * pageSize, orders?.count || 0)}
              </span>{" "}
              of <span className="font-medium">{orders?.count}</span> results
            </p>
          </div>
          <div className="flex flex-1 justify-between sm:justify-end">
            <button
              className="inline-flex items-center px-3 py-2 text-sm text-gray-900"
              onClick={handlePrevPage}
              disabled={currentPage === 0}
            >
              <i className="fa-solid fa-chevron-left" />
            </button>
            <button
              className="ml-3 inline-flex items-center px-3 py-2 text-sm text-gray-900"
              onClick={handleNextPage}
              disabled={orders && orders.count <= pageSize * (currentPage + 1)}
            >
              <i className="fa-solid fa-chevron-right" />
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
