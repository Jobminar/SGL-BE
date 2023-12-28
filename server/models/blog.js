import { Schema, model } from "mongoose";

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type:Buffer,
  },
});

const Blog = model("Blog", blogSchema);

export default Blog;
