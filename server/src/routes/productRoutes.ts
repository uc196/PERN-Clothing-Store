import express from "express";
import {
  createProduct,
  getFlashDeals,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import auth from "../middleware/auth";
import {admin} from "../middleware/admin";

const productRouter = express.Router();

productRouter.get("/getFlashDeals", getFlashDeals);
productRouter.get("/getProducts", getProducts);
productRouter.get("/getProduct/:id", getProductById);
productRouter.post("/", auth, admin, createProduct);
productRouter.put("/:id", auth, admin, updateProduct);
productRouter.delete("/:id", auth, admin, deleteProduct);

export default productRouter;