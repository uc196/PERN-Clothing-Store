import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* ==========================
   DELIVERY PARTNER LOGIN
========================== */
export const deliveryPartnerLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const partner = await prisma.deliveryPartner.findUnique({
      where: { email },
    });

    if (!partner) {
      return res.status(404).json({
        message: "Delivery partner not found",
      });
    }

    if (!partner.isActive) {
      return res.status(403).json({
        message: "Account is deactivated. Contact admin.",
      });
    }

    const isMatch = await bcrypt.compare(password, partner.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: partner.id,
        role: "delivery",
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      partner: {
        id: partner.id,
        name: partner.name,
        email: partner.email,
        phone: partner.phone,
        isActive: partner.isActive,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

/* ==========================
   GET MY DELIVERIES
========================== */
export const getMyDeliveries = async (req: Request, res: Response) => {
  try {
    const deliveryPartnerId = (req as any).deliveryPartnerId;

    if (!deliveryPartnerId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const deliveries = await prisma.order.findMany({
      where: {
        deliveryPartnerId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Deliveries fetched successfully",
      deliveries,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

/* ==========================
   UPDATE LOCATION
========================== */
export const updateLocation = async (req: Request, res: Response) => {
  try {
    const deliveryPartnerId = (req as any).deliveryPartnerId;
    const { orderId } = req.params;
    const { lat, lng, status } = req.body;

    if (!deliveryPartnerId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({
        message: "Latitude and longitude are required",
      });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId as string,
        deliveryPartnerId,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId as string,
      },
      data: {
        ...(status && { status }),
        liveLocation: {
          lat: Number(lat),
          lng: Number(lng),
          updatedAt: new Date(),
        },
      },
    });

    return res.status(200).json({
      message: "Location updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

/* ==========================
   COMPLETE DELIVERY
========================== */
export const completeDelivery = async (req: Request, res: Response) => {
  try {
    const deliveryPartnerId = (req as any).deliveryPartnerId;
    const { orderId } = req.params;
    const { otp } = req.body;

    if (!deliveryPartnerId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!otp) {
      return res.status(400).json({
        message: "OTP is required",
      });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId as string,
        deliveryPartnerId,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (String(order.deliveryOtp) !== String(otp)) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId as string,
      },
      data: {
        status: "Delivered",
        deliveryOtp: null,
      },
    });

    return res.status(200).json({
      message: "Delivery completed successfully",
      order: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

/* ==========================
   CANCEL DELIVERY
========================== */
export const cancelDelivery = async (req: Request, res: Response) => {
  try {
    const deliveryPartnerId = (req as any).deliveryPartnerId;
    const { orderId } = req.params;

    if (!deliveryPartnerId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId as string,
        deliveryPartnerId,
      },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId as string,
      },
      data: {
        status: "Cancelled",
      },
    });

    return res.status(200).json({
      message: "Delivery cancelled successfully",
      order: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

/* ==========================
   GET DELIVERY PARTNER PROFILE
========================== */
export const getDeliveryPartnerProfile = async (req: Request, res: Response) => {
  try {
    const deliveryPartnerId = (req as any).deliveryPartnerId;

    if (!deliveryPartnerId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const partner = await prisma.deliveryPartner.findUnique({
      where: {
        id: deliveryPartnerId,
      },
      include: {
        orders: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!partner) {
      return res.status(404).json({
        message: "Delivery partner not found",
      });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      partner,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};