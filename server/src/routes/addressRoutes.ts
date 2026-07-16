import { Router } from "express";
import auth from "../middleware/auth";

import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/addressController";

const addressRouter = Router();

/* -----------------------------
   ADDRESS ROUTES (AUTH REQUIRED)
------------------------------*/

// Get all user addresses
addressRouter.get("/", auth, getAddresses);

// Add new address
addressRouter.post("/", auth, addAddress);

// Update address
addressRouter.put("/:id", auth, updateAddress);

// Delete address
addressRouter.delete("/:id", auth, deleteAddress);

// Set default address
addressRouter.patch("/:id/default", auth, setDefaultAddress);

export default addressRouter;