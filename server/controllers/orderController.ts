import { Request, Response } from "express";
import { prisma } from "../prisma/client.js";
import { inngest } from "../inngest/index.js";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get product IDs
    const productIds = items.map((item: any) => item.productId);

    // Fetch products
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // Map products
    const productMap: Record<string, any> = {};
    products.forEach((product) => {
      productMap[product.id] = product;
    });

    // Validate stock
    for (const item of items) {
      const product = productMap[item.productId];

      if (!product || (product.stock ?? 0) < item.quantity) {
        return res.status(400).json({
          message: `Product ${item.productId} is out of stock`,
        });
      }
    }

    // Build order items
    const orderItems = items.map((item: any) => {
      const dbProduct = productMap[item.productId];

      return {
        productId: item.productId,
        name: dbProduct.name,
        image: dbProduct.image,
        price: dbProduct.price,
        quantity: item.quantity,
        unitPrice: dbProduct.price,
      };
    });

    // Pricing
    const subtotal = orderItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );

    const deliveryFee = subtotal > 20 ? 0 : 10;
    const tax = Math.round(subtotal * 0.1 * 100) / 100;
    const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;

    // Create order (STARTS IN LIFECYCLE: PLACED)
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

    // Decrease stock
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

    // 🔥 TRIGGER EVENT (START FULL LIFECYCLE FLOW)
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