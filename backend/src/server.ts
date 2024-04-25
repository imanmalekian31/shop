import express, { type Request, type Response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import { Order } from "./models";

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/ordersDB");

app.post("/orders", async (req: Request, res: Response) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).send(order);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/orders", async (req: Request, res: Response) => {
  const { offset = 0, limit = 10 } = req.query;

  try {
    const offsetNum = parseInt(offset as string);
    const limitNum = parseInt(limit as string);

    const [orders, countOrders] = await Promise.all([
      Order.find()
        .sort({ order_date: 1 })
        .skip(offsetNum)
        .limit(limitNum)
        .select("-__v"),
      Order.countDocuments(),
    ]);

    res.status(200).send({
      results: orders,
      count: countOrders,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error retrieving the orders", error: error });
  }
});

app.get("/orders/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid order ID format" });
  }

  try {
    const order = await Order.findById(id).select("-__v");

    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    res.send(order);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).send({ message: "Invalid order ID format" });
    }
    res.status(500).send({ message: "Server error", error: error });
  }
});

app.patch("/orders/:id", async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!order) {
      return res.status(404).send();
    }
    res.send(order);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete("/orders/:id", async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).send();
    }
    res.send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
