// contactModel.js
import { Schema, model } from "mongoose";

const contactSchema = Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: Number, required: true },
  message: { type: String, required: true }
});

const Contacts = model("Contacts", contactSchema);

export default Contacts;
