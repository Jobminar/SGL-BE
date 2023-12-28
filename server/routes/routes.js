import express from "express";
import controller from "../controller/admincontroller.js";
import blogController from "../controller/blogcontroller.js";
import ordercontroller from "../controller/ordercontroller.js";
import userController from "../controller/usercontroller.js";
import inventorycontroller from "../controller/inventorycontroller.js"

const router = express.Router();

// Admin registration route________________________________
router.post("/register", controller.registerAdmin);

// Admin login route
router.post("/login", controller.loginAdmin);

// Verify OTP route
router.post("/verifyotp", controller.verifyOTP);

// Admin profile route
router.get("/adminprofile", controller.getadminProfile);

// Get all blogs________________________________________________________________________________
router.get("/blogsget", blogController.getAllBlogs);

// Add a new blog
router.post("/blogspost", blogController.addBlog);

// Update a blog
router.put("/blogs/:id", blogController.updateBlog);

// Delete a blog
router.delete("/blogs/:id", blogController.deleteBlog);

//Add a new Inventory  item_____________________________________________________
// router.post("/add", inventorycontroller.addItem);
//get a new Inventory  item
// router.get("/get", inventorycontroller.getInventory);
//Delete a new Inventory  item
router.delete("/delete/:itemId", inventorycontroller.deleteItem);

router.post("/orderPost", ordercontroller.addOrder);
//get a new  order ___________________________________________________________
router.get("/ordergetall", ordercontroller.getAllOrders);
//update an order status
router.put("/orders/:orderId/update-status", ordercontroller.updateOrderStatus);
//delete an order
router.delete("/orders/:orderId/cancel", ordercontroller.cancelOrder);
//update an order
router.put("/orders/:orderId/refund", ordercontroller.refundOrder);

//add a user_____________________________________________________
router.post("/userRegister", userController.registerUser);
//logging in a user
router.post("/userLogin", userController.loginUser);
//verify the user
router.post("/userVerify", userController.verifyUserOTP);
//get the user profile
router.get("/userprofile", userController.getUserProfile);
//add inventory__________________________________________________
router.post("/addItem", inventorycontroller.addItem);
//get inventory items
router.get("/getallItems", inventorycontroller.getInventory);
//delete inventory items
router.delete("/delete-item/:itemId", inventorycontroller.deleteItem);

export default router;
