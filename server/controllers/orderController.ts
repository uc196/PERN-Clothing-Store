import { Request, Response } from "express";
import { prisma } from "../prisma/client.js";
import { inngest } from "../inngest/index.js";

/* ---------------- CREATE ORDER ---------------- */
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const productIds = items.map((item: any) => item.productId);

    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap: Record<string, any> = {};
    products.forEach((p) => {
      productMap[p.id] = p;
    });

    for (const item of items) {
      const product = productMap[item.productId];

      if (!product || (product.stock ?? 0) < item.quantity) {
        return res.status(400).json({
          message: `Product ${item.productId} is out of stock`,
        });
      }
    }

    const orderItems = items.map((item: any) => {
      const p = productMap[item.productId];

      return {
        productId: item.productId,
        name: p.name,
        image: p.image,
        price: p.price,
        quantity: item.quantity,
      };
    });

    const subtotal = orderItems.reduce(
      (sum: number, i: any) => sum + i.price * i.quantity,
      0
    );

    const deliveryFee = subtotal > 20 ? 0 : 10;
    const tax = subtotal * 0.1;
    const total = subtotal + deliveryFee + tax;

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        subtotal,
        deliveryFee,
        tax,
        total,
        status: "placed",
        statusHistory: [
          {
            status: "placed",
            date: new Date(),
          },
        ],
      },
    });

    for (const item of orderItems) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    await inngest.send({
      name: "order/created",
      data: {
        orderId: order.id,
      },
    });

    return res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

/* ---------------- GET USER ORDERS ---------------- */
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: req.user?.id,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

/* ---------------- GET SINGLE ORDER ---------------- */
export const getOrder = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id as string,
        userId: req.user?.id,
      },
      include: {
        deliveryPartner: {
          select: { name: true, phone: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json(order);
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

/* ---------------- GET ALL ORDERS (ADMIN) ---------------- */
export const getAllOrders = async (_: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, email: true },
        },
        deliveryPartner: {
          select: { name: true, phone: true },
        },
      },
    });

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

/* ---------------- UPDATE ORDER STATUS ---------------- */
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status, note } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: req.params.id  as string},
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const history = Array.isArray(order.statusHistory)
      ? order.statusHistory
      : [];

   history.push({
  status,
  note: note || `order ${status.toLowerCase()}`,
  date: new Date().toISOString(),
});

    const updated = await prisma.order.update({
      where: { id: req.params.id as string },
      data: {
        status,
        statusHistory: history,
      },
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

/* ---------------- ORDER LOCATION (TRACKING) ---------------- */
export const getOrderLocation = async (req: Request, res: Response) => {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: req.params.id as string,
        userId: req.user?.id,
      },
      select: {
        liveLocation: true,
        status: true,
        deliveryPartnerId: true,
      },
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.json({
      liveLocation: order.liveLocation,
      status: order.status,
      riderAssigned: !!order.deliveryPartnerId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};