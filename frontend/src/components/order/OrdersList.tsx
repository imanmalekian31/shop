import { Link } from "react-router-dom";
import { OrderDoc } from "../../../../backend/src/types";
import { Pagination } from "../../types";

interface Props {
  orders: Pagination<OrderDoc>;
  currentPage: number;
  pageSize: number;
  handleDelete: (id: string) => void;
}

export function OrdersList({
  orders,
  currentPage,
  pageSize,
  handleDelete,
}: Props) {
  return (
    <>
      <div className="mt-4">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50 whitespace-nowrap">
            <tr>
              <th className="table-th" />
              <th className="table-th">Customer Name</th>
              <th className="table-th">Address</th>
              <th className="table-th">Order Date</th>
              <th className="table-th hidden sm:table-cell">Items</th>
              <th className="table-th" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders?.results.map((order, index) => (
              <tr key={order._id}>
                <td className="table-td">
                  {currentPage * pageSize + (index + 1)}
                </td>
                <td className="table-td">{order.customer_name}</td>
                <td className="table-td">{order.address}</td>
                <td className="table-td">
                  {new Date(order.order_date).toLocaleDateString()}
                </td>
                <td className="table-td text-xs md:text-base hidden sm:table-cell">
                  {order.items
                    .map((item) => `${item.quantity}x ${item.product_name}`)
                    .join(", ")}
                </td>
                <td className="table-td">
                  <Link
                    className="text-gray-500 hover:text-gray-700 m-2"
                    to={`/details?id=${order._id}`}
                  >
                    <i className="fa-regular fa-eye" />
                  </Link>
                  <Link
                    className="text-indigo-500 hover:text-indigo-700 m-2"
                    to={`/form?id=${order._id}`}
                  >
                    <i className="fa-solid fa-pen" />
                  </Link>
                  <button
                    className="text-red-500 hover:text-red-700 m-2"
                    onClick={() => handleDelete(order._id)}
                  >
                    <i className="fa-solid fa-trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
