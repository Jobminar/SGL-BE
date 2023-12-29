
import { Schema, model } from 'mongoose';

const loginSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  whatsapp: { type: String },
  image: { type: String,required:true }, 
  resetToken: String,
  resetTokenExpiration: Date,
});

const Login = model('Login', loginSchema);

export default Login;
