import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { useCreateOrder, useUpdateOrder, getOrder } from "../../services";
import type { Order } from "../../../../backend/src/types";
import { toast } from "sonner";
import { clsx } from "clsx";

export function OrderForm() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("id");

  const navigate = useNavigate();
  const isUpdateMode = Boolean(orderId);

  const createMutation = useCreateOrder();
  const updateMutation = useUpdateOrder();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<Order>({
    defaultValues: {
      customer_name: "",
      address: "",
      order_date: new Date().toISOString().split("T")[0] as unknown as Date,
      items: [{ product_name: "", quantity: 0, price_per_unit: 0 }],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    async function fetchOrder() {
      if (isUpdateMode && orderId) {
        try {
          const data = await getOrder<Order>(orderId);
          setValue("customer_name", data.customer_name);
          setValue("address", data.address);
          setValue(
            "order_date",
            new Date(data.order_date)
              .toISOString()
              .split("T")[0] as unknown as Date
          );
          data.items.forEach((item, index) => {
            if (index === 0) {
              update(index, item);
            } else {
              append(item);
            }
          });
        } catch (error) {
          console.error("Failed to fetch order details:", error);
        }
      }
    }

    fetchOrder();
  }, [orderId, isUpdateMode, setValue]);

  const onSubmit = async (formData: Order) => {
    try {
      if (isUpdateMode && orderId) {
        await updateMutation.mutateAsync({
          id: orderId,
          payload: formData,
        });
        toast.success("Order updated successfully!");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Order created successfully!");
      }
      navigate("/");
      reset();
    } catch (err) {
      toast.error("Failed to submit order");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" container mx-auto p-4 space-y-4"
    >
      <h2 className="text-lg font-semibold">
        {isUpdateMode ? "Update" : "Create"} Order
      </h2>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="customer_name"
            className="block text-sm font-medium text-gray-700"
          >
            Customer Name:
          </label>
          <input
            {...register("customer_name", {
              required: "Customer name is required",
            })}
            placeholder="Customer Name"
            className={clsx(
              "form-input",
              errors.customer_name &&
                "!border-red-500  focus:border-red-500 focus:ring-red-500"
            )}
          />
          {errors.customer_name && (
            <p className="text-red-500 text-xs mt-1">
              {errors.customer_name.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address:
          </label>
          <input
            {...register("address", { required: "Address is required" })}
            placeholder="Address"
            className={clsx(
              "form-input",
              errors.address &&
                "!border-red-500  focus:border-red-500 focus:ring-red-500"
            )}
          />
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">
              {errors.address.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="order_date"
            className="block text-sm font-medium text-gray-700"
          >
            Order Date:
          </label>
          <input
            type="date"
            {...register("order_date", { required: "Order date is required" })}
            className={clsx(
              "form-input",
              errors.order_date &&
                "!border-red-500  focus:border-red-500 focus:ring-red-500"
            )}
          />
          {errors.order_date && (
            <p className="text-red-500 text-xs mt-1">
              {errors.order_date.message}
            </p>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Items</h3>
          {fields.map((item, index) => (
            <div key={index}>
              <div
                key={item.id}
                className="grid grid-cols-3 sm:grid-cols-6 gap-4 mt-2"
              >
                <input
                  {...register(`items.${index}.product_name`, {
                    required: "Product name is required",
                  })}
                  defaultValue={item.product_name}
                  className={clsx(
                    "form-input col-span-3",
                    errors.items?.[index]?.product_name &&
                      "!border-red-500 focus:border-red-500 focus:ring-red-500"
                  )}
                  placeholder="Product Name"
                />
                <input
                  {...register(`items.${index}.quantity`)}
                  type="number"
                  defaultValue={item.quantity}
                  className="form-input"
                  placeholder="Quantity"
                />
                <input
                  {...register(`items.${index}.price_per_unit`)}
                  type="number"
                  defaultValue={item.price_per_unit}
                  className="form-input"
                  placeholder="Price Per Unit"
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="mt-2 !ml-4 text-left text-red-500 hover:text-red-700 focus:outline-none"
                >
                  <i className="fa-solid fa-trash" />
                </button>
              </div>
              <div>
                {errors.items?.[index]?.product_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {
                      // @ts-expect-error all things checked
                      errors.items[index].product_name.message
                    }
                  </p>
                )}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              append({ product_name: "", quantity: 0, price_per_unit: 0 })
            }
            className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Item
          </button>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            isSubmitting ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {isSubmitting
            ? "Submitting..."
            : isUpdateMode
            ? "Update Order"
            : "Submit Order"}
        </button>
      </div>
    </form>
  );
}
