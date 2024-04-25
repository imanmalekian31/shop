import { generatePDF } from "./utils";
import type { OrderDoc } from "../../../../../backend/src/types";

interface Props {
  order: OrderDoc;
}

export function OrderDetails({ order }: Props) {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
        <button
          className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() => generatePDF(order)}
        >
          <i className="fa-regular fa-file-pdf" />
        </button>
      </div>

      <div className="mt-4">
        <p className="font-semibold">
          Customer Name:{" "}
          <span className="font-normal">{order.customer_name}</span>
        </p>
        <p className="font-semibold">
          Address: <span className="font-normal">{order.address}</span>
        </p>
        <p className="font-semibold">
          Order Date:{" "}
          <span className="font-normal">
            {new Date(order.order_date).toLocaleDateString()}
          </span>
        </p>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-bold text-gray-800">Items</h3>
        <div className="mt-2 divide-y-2 divide-gray-200">
          {order.items.map((item, index) => (
            <div key={index} className="p-2">
              <p>
                <span className="text-lg text-gray-900">Product:</span>
                <span className="ml-2 text-base text-gray-500">
                  {item.product_name}
                </span>
              </p>
              <p>
                <span className="text-lg text-gray-900">Quantity:</span>
                <span className="ml-2 text-base text-gray-500">
                  {item.quantity}
                </span>
              </p>
              <p>
                <span className="text-lg text-gray-900">Price per Unit:</span>
                <span className="ml-2 text-base text-gray-500">
                  ${item.price_per_unit.toFixed(2)}
                </span>
              </p>
              <p>
                <span className="text-lg text-gray-900">Total:</span>
                <span className="ml-2 text-base text-gray-500">
                  ${(item.quantity * item.price_per_unit).toFixed(2)}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
