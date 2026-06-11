import { Inngest } from "inngest";
import { prisma } from "../prisma/client.js";
import { sendEmail } from "../config/services.js";

const LOW_STOCK_THRESHOLD = 10;

export const inngest = new Inngest({
  id: "fashion-store",
});

/* -----------------------------
   LOW STOCK ALERT
------------------------------*/
const checkLowStock = inngest.createFunction(
  {
    id: "check-low-stock",
    name: "Low Stock Alert",
    triggers: [{ event: "inventory/stock.updated" }],
  },
  async ({ event, step }: { event: any; step: any }) => {
    const productID = event.data.productID;

    const product = await step.run("fetch-product", async () => {
      return prisma.product.findUnique({
        where: { id: productID },
      });
    });

    if (!product || product.stock >= LOW_STOCK_THRESHOLD) {
      return { skipped: true };
    }

    const adminEmails = process.env.ADMIN_EMAIL
      ? process.env.ADMIN_EMAIL.split(",").map((e) => e.trim())
      : [];

    if (!adminEmails.length) return { skipped: true };

    await step.run("send-email", async () => {
      return sendEmail({
        to: adminEmails.join(","),
        subject: "⚠️ Low Stock Alert",
        html: `<p>${product.name} is low on stock (${product.stock})</p>`,
      });
    });

    return { success: true };
  }
);

/* -----------------------------
   MONTHLY OFFERS
------------------------------*/
const sendMonthlyOffers = inngest.createFunction(
  {
    id: "send-monthly-offers",
    name: "Monthly Payday Offers",
    triggers: [{ cron: "0 10 1 * *" }],
  },
  async ({ step }: { step: any }) => {
    const users = await step.run("fetch-users", async () => {
      return prisma.user.findMany({
        select: { email: true },
      });
    });

    const emails = users.map((u: { email: string }) => u.email);

    if (!emails.length) return { skipped: true };

    await step.run("send-offers", async () => {
      return sendEmail({
        to: emails.join(","),
        subject: "🎉 Monthly Payday Offers",
        html: `<h1>Big Discounts This Month</h1>`,
      });
    });

    return { success: true };
  }
);

/* -----------------------------
   AUTO ASSIGN RIDER
------------------------------*/
export const assignRider = inngest.createFunction(
  {
    id: "assign-rider",
    name: "Auto Assign Delivery Rider",
    triggers: [{ event: "order/created" }],
  },
  async ({ event, step }: { event: any; step: any }) => {
    const orderId = event.data.orderId;

    await step.sleep("wait-5-min", "5m");

    const order = await step.run("fetch-order", async () => {
      return prisma.order.findUnique({
        where: { id: orderId },
      });
    });

    if (!order) return { skipped: true };

    const rider = await step.run("find-rider", async () => {
      return prisma.deliveryPartner.findFirst({
        where: {
          isOnline: true,
          isBusy: false,
        },
      });
    });

    if (!rider) return { skipped: true };

    await step.run("assign-rider", async () => {
      return prisma.order.update({
        where: { id: orderId },
        data: {
          deliveryPartnerId: rider.id,
          status: "processing",
        },
      });
    });

    await step.run("mark-rider-busy", async () => {
      return prisma.deliveryPartner.update({
        where: { id: rider.id },
        data: { isBusy: true },
      });
    });

    return {
      success: true,
      rider: rider.name,
      orderId,
    };
  }
);

/* -----------------------------
   OTP FOR ORDER COLLECTION
------------------------------*/
const sendOrderOtp = inngest.createFunction(
  {
    id: "send-order-otp",
    name: "Send Order Collection OTP",
    triggers: [{ event: "order/ready-for-collection" }],
  },
  async ({ event, step }: { event: any; step: any }) => {
    const orderId = event.data.orderId;

    const order = await step.run("fetch-order", async () => {
      return prisma.order.findUnique({
        where: { id: orderId },
        include: { user: true },
      });
    });

    if (!order) return { skipped: true };

    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to order
    await step.run("save-otp", async () => {
      return prisma.order.update({
        where: { id: orderId },
        data: { deliveryOtp: otp },
      });
    });

    // Send OTP email
    await step.run("send-otp-email", async () => {
      return sendEmail({
        to: order.user.email,
        subject: "🔐 Order Collection OTP",
        html: `
          <h2>Your Order is Ready</h2>
          <p>Use this OTP to collect your order:</p>
          <h1>${otp}</h1>
          <p>This code expires soon. Do not share it.</p>
        `,
      });
    });

    return {
      success: true,
      orderId,
    };
  }
);

/* -----------------------------
   EXPORT ALL FUNCTIONS
------------------------------*/
export const functions = [
  checkLowStock,
  sendMonthlyOffers,
  assignRider,
  sendOrderOtp,
];