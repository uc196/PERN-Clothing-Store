import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export const getFlashDeals = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        stock: { gt: 0 },
      },
      orderBy: {
        originalPrice: "desc",
      },
    });

    const productsWithDiscount = products.map((product) => {
      const discount =
        product.originalPrice && product.price
          ? Math.round(
              ((product.originalPrice - product.price) / product.originalPrice) *
                100
            )
          : 0;

      return {
        ...product,
        discount,
      };
    });

    return res.json({
      products: productsWithDiscount.slice(0, 10),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;

    const where: any = {};

    if (typeof category === "string" && category !== "all") {
      where.category = category;
    }

    if (typeof search === "string") {
      where.name = { contains: search, mode: "insensitive" };
    }

    if (typeof minPrice === "string") {
      where.price = { ...(where.price || {}), gte: Number(minPrice) };
    }

    if (typeof maxPrice === "string") {
      where.price = { ...(where.price || {}), lte: Number(maxPrice) };
    }

    const orderBy: any = {};
    if (sort === "price_asc") orderBy.price = "asc";
    else if (sort === "price_desc") orderBy.price = "desc";
    else orderBy.createdAt = "desc";

    const products = await prisma.product.findMany({
      where,
      orderBy,
    });

    const productsWithDiscount = products.map((product) => {
      const discount =
        product.originalPrice && product.price
          ? Math.round(
              ((product.originalPrice - product.price) / product.originalPrice) *
                100
            )
          : 0;

      return {
        ...product,
        discount,
      };
    });

    return res.json({
      products: productsWithDiscount,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id as string },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const discount =
      product.originalPrice && product.price
        ? Math.round(
            ((product.originalPrice - product.price) / product.originalPrice) *
              100
          )
        : 0;

    return res.json({
      ...product,
      discount,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const product = await prisma.product.create({
    data: req.body,
  })
  return res.status(201).json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  const product = await prisma.product.update({
    where: { id: req.params.id as string },
    data: req.body,
  })
  return res.json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  await prisma.product.delete({
    where: { id: req.params.id as string },
  })
  return res.status(204).send();
};

