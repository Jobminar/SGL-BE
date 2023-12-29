import { Schema, model } from "mongoose";

const gemsSchema = Schema({
  
  name: { type: String, required: true },
  email:{type:String,required:true},
  mobile:{type:Number,required:true},
  message:{type:String,required:true}
});

const Gems = model("Gems", gemsSchema);

export default Gems;
