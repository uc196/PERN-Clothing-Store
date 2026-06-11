import Express from "express";
import {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  getAllOrders,
  getOrderLocation,
} from "../controllers/orderController.js";
import  auth  from "../middleware/auth.js";
import { admin } from "../middleware/admin.js";

const orderRouter = Express.Router();

// User routes
orderRouter.post("/", auth, createOrder);
orderRouter.get("/", auth, getUserOrders);
orderRouter.get("/:id", auth, getOrder);
orderRouter.get("/:id/location", auth, getOrderLocation);

// Admin routes
orderRouter.put("/:id/status", auth, admin, updateOrderStatus);
orderRouter.get("/admin/all", auth, admin, getAllOrders);

export default orderRouter;