import { Request, Response } from "express";
import { prisma } from "../prisma/client";
import  bcrypt from "bcrypt"
import { sendEmail } from "../config/services";


export const getAdminDashboard = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({
        message: "Forbidden: Admin only",
      });
    }

    // 📦 Total Orders
    const totalOrders = await prisma.order.count();

    // 👤 Total Users
    const totalUsers = await prisma.user.count();

    // 🛍 Total Products
    const totalProducts = await prisma.product.count();

    // 🚫 Out Of Stock Products
    const outOfStockProducts = await prisma.product.count({
      where: {
        stock: {
          lte: 0,
        },
      },
    });

    // 🚚 Total Delivery Partners
    const totalPartners = await prisma.deliveryPartner.count();

    // 💰 Payment Method Breakdown
    const paymentMethods = await prisma.order.groupBy({
      by: ["paymentMethod"],
      _count: {
        paymentMethod: true,
      },
    });

    // 💳 Paid Orders
    const paidOrders = await prisma.order.count({
      where: {
        isPaid: true,
      },
    });

    // 💳 Unpaid Orders
    const unpaidOrders = await prisma.order.count({
      where: {
        isPaid: false,
      },
    });

    // 📊 Order Status Funnel
    const placedOrders = await prisma.order.count({
      where: { status: "placed" },
    });

    const processingOrders = await prisma.order.count({
      where: { status: "processing" },
    });

    const shippedOrders = await prisma.order.count({
      where: { status: "shipped" },
    });

    const deliveredOrders = await prisma.order.count({
      where: { status: "delivered" },
    });

    // 🧾 Recent Orders
    const recentOrders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        deliveryPartner: {
          select: {
            name: true,
            phone: true,
          },
        },
      },
    });

    // 📈 Sales Per Product
    const orders = await prisma.order.findMany({
      select: {
        items: true,
      },
    });

    const productSales: Record<
      string,
      {
        name: string;
        quantity: number;
      }
    > = {};

    for (const order of orders) {
      const items = order.items as any[];

      for (const item of items) {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            name: item.name,
            quantity: 0,
          };
        }

        productSales[item.productId].quantity += item.quantity;
      }
    }

    const topProducts = Object.entries(productSales)
      .map(([productId, data]) => ({
        productId,
        ...data,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    return res.json({
      summary: {
        totalOrders,
        totalUsers,
        totalProducts,
        outOfStockProducts,
        totalPartners,
        paidOrders,
        unpaidOrders,
      },

      orderStatus: {
        placed: placedOrders,
        processing: processingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
      },

      paymentMethods,

      topProducts,

      recentOrders,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

export const getAllDeliveryPartners = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({
        message: "Forbidden: Admin only",
      });
    }

    const partners = await prisma.deliveryPartner.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      total: partners.length,
      partners,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};


export const createDeliveryPartner = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({
        message: "Forbidden: Admin only",
      });
    }

    const { name, phone, email, password, vehicleType } = req.body;

    // validation
    if (!name || !phone || !password) {
      return res.status(400).json({
        message: "Name, phone and password are required",
      });
    }

    // check existing
    const existing = await prisma.deliveryPartner.findFirst({
      where: {
        OR: [{ phone }, { email }],
      },
    });

    if (existing) {
      return res.status(409).json({
        message: "Delivery partner already exists",
      });
    }

    // 🔐 hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const partner = await prisma.deliveryPartner.create({
      data: {
        name,
        phone,
        email,
        vehicleType,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: "Delivery partner created successfully",
      partner: {
        id: partner.id,
        name: partner.name,
        phone: partner.phone,
        email: partner.email,
        vehicleType: partner.vehicleType,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

export const updateDeliveryPartner = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({
        message: "Forbidden: Admin only",
      });
    }

    const { id } = req.params;
    const { name, phone, email, password, vehicleType } = req.body;

    // 🔎 check if partner exists
    const partner = await prisma.deliveryPartner.findUnique({
      where: { id : req.params.id as string},
    });

    if (!partner) {
      return res.status(404).json({
        message: "Delivery partner not found",
      });
    }

    // 🔐 prepare update data
    const updateData: any = {};

    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (email) updateData.email = email;
    if (vehicleType) updateData.vehicleType = vehicleType;

    // 🔐 hash password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // 🛠 update partner
    const updatedPartner = await prisma.deliveryPartner.update({
      where: { id : req.params.id as string },
      data: updateData,
    });

    return res.json({
      message: "Delivery partner updated successfully",
      partner: {
        id: updatedPartner.id,
        name: updatedPartner.name,
        phone: updatedPartner.phone,
        email: updatedPartner.email,
        vehicleType: updatedPartner.vehicleType,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const assignOrderToRider = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admin only" });
    }

    const { orderId, deliveryPartnerId } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const partner = await prisma.deliveryPartner.findUnique({
      where: { id: deliveryPartnerId },
    });

    if (!partner) {
      return res.status(404).json({ message: "Delivery partner not found" });
    }

    const otp = generateOTP();

    const existingHistory = Array.isArray(order.statusHistory)
      ? order.statusHistory
      : [];

    const newHistory = [
      ...existingHistory,
      {
        status: "assigned",
        date: new Date(),
        note: `Order assigned to rider ${partner.name}`,
      },
    ];

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        deliveryPartnerId,
        deliveryOtp: otp,
        status: "assigned",
        statusHistory: newHistory,
      },
    });

    // 📩 SEND OTP
    await sendEmail({
      to: partner.email || order.user.email,
      subject: "Delivery OTP Assigned",
      html: `
        <h2>Order Assigned</h2>
        <p><b>Order ID:</b> ${order.id}</p>
        <p><b>OTP:</b> <h1>${otp}</h1></p>
        <p>Please use this OTP to confirm delivery.</p>
      `,
    });

    return res.json({
      message: "Order assigned successfully",
      order: updatedOrder,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};