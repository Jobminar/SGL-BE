import { Schema, model } from 'mongoose';

const jewelrySchema = Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  weight: { type: Number, required: true },
  colour: { type: String, required: true },
  subtype: { type: String, required: true },
  units: { type: String, required: true },
  value: { type: String, required: true },
  shape: { type: String, required: true },
});

const jewelry = model('jewelry', jewelrySchema);

export default jewelry;
