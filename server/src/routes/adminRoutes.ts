import express from "express";
import auth from "../middleware/auth";
import { admin } from "../middleware/admin";

import {
  getAdminDashboard,
  getAllDeliveryPartners,
  createDeliveryPartner,
  updateDeliveryPartner,
  assignOrderToRider,
} from "../controllers/adminController";

const adminRouter = express.Router();

/* =========================
   📊 ADMIN DASHBOARD
========================= */
adminRouter.get("/stats", auth, admin, getAdminDashboard);

/* =========================
   🚚 DELIVERY PARTNERS
========================= */

// Get all delivery partners
adminRouter.get(
  "/delivery-partners",
  auth,
  admin,
  getAllDeliveryPartners
);

// Create delivery partner
adminRouter.post(
  "/delivery-partners",
  auth,
  admin,
  createDeliveryPartner
);

// Update delivery partner
adminRouter.put(
  "/delivery-partners/:id",
  auth,
  admin,
  updateDeliveryPartner
);

/* =========================
   🚚 ORDER ASSIGNMENT
========================= */

// Assign order to rider + OTP generation
adminRouter.post(
    '/orders/:id/ assign',
  auth,
  admin,
  assignOrderToRider
);

export default adminRouter;