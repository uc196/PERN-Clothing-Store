import express from "express";

import {
  deliveryPartnerLogin,
  getMyDeliveries,
  updateLocation,
  completeDelivery,
  cancelDelivery,
} from "../controllers/deliveryPartenerController"

import { deliveryAuthMiddleware } from "../middleware/deliveryAuth";

const router = express.Router();

// Public
router.post("/login", deliveryPartnerLogin);

// Protected
router.get(
  "/my-deliveries",
  deliveryAuthMiddleware,
  getMyDeliveries
);

router.patch(
  "/orders/:orderId/location",
  deliveryAuthMiddleware,
  updateLocation
);

router.patch(
  "/orders/:orderId/complete",
  deliveryAuthMiddleware,
  completeDelivery
);

router.patch(
  "/orders/:orderId/cancel",
  deliveryAuthMiddleware,
  cancelDelivery
);


export default router;