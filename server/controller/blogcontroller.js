import Blog from "../models/blog.js";

const blogController = {
  getAllBlogs: async (_req, res) => {
    try {
      const blogs = await Blog.find();
      res.json(blogs);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  addBlog: async (req, res) => {
    try {
      const newBlog = await Blog.create(req.body);
      res.status(201).json(newBlog);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateBlog: async (req, res) => {
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(updatedBlog);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteBlog: async (req, res) => {
    try {
      await Blog.findByIdAndDelete(req.params.id);
      res.json({ message: "Blog deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default blogController;
