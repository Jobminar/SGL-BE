// InventoryModel.js
import { Schema, model } from "mongoose";
const inventorySchema = new Schema({
  type: String,
  subtype: String,
  name: String,
  weight: String,
  shape: String,
  price: Number,
  color: String,
  value: String,
  image:Buffer,
});

const Inventory = model("Inventory", inventorySchema);

export default Inventory;
