
import Order from "../models/OrderModel.js";

import mongoose from "mongoose";

const addOrder = async (req, res) => {
  try {
    const { username, items, orderID, date, status, address } = req.body;

    // Create a new order hii
    const newOrder = new Order({
      username,
      items,
      orderID,
      date,
      status,
      address
    });

    // Save the new order to the database
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
    console.log("ordered....")
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// const updateOrderStatus = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const updatedOrder = await Order.findByIdAndUpdate(
//       orderId,
//       { status: "Delivered" },
//       { new: true }
//     );
//     res.status(200).json(updatedOrder);
//   } catch (error) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Check if orderId is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    // Check if order exists
    const existingOrder = await Order.findById(orderId);
    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update order status
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: "Delivered" },
      { new: true }
    );

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};




const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    await Order.findByIdAndDelete(orderId);
    res.status(204).send("order deleted");
    console.log("order deleted")
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const refundOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: "Refunded" },
      { new: true }
    );
    res.status(200).json(updatedOrder);
    console.log("refund",null)
  } 
  catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {
  addOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  refundOrder,
};
