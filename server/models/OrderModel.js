// OrderModel.js
import { Schema, model } from "mongoose";

const orderSchema = new Schema({
  username: String,
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  orderID: String,
  date: String,
  status: String,
  address: String,
});

const Order = model("Order", orderSchema);

export default Order;
