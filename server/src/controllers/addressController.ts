import { Request, Response } from "express";
import { prisma } from "../prisma/client";

/* -----------------------------
   GET ADDRESSES
------------------------------*/
export const getAddresses = async (req: Request, res: Response) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user!.id as string },
      orderBy: { createdAt: "asc" },
    });

    return res.json({ addresses });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch addresses",
      error,
    });
  }
};

/* -----------------------------
   ADD ADDRESS
------------------------------*/
export const addAddress = async (req: Request, res: Response) => {
  try {
    const {
      label,
      address,
      city,
      state,
      zip,
      isDefault,
      lat,
      lng,
    } = req.body;

    if (lat == null || lng == null) {
      return res.status(400).json({
        message: "Latitude and Longitude are required",
      });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user!.id },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: req.user!.id,
        label,
        address,
        city,
        state,
        zip,
        isDefault: isDefault || false,
        lat,
        lng,
      },
    });

    return res.status(201).json({
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to add address",
      error,
    });
  }
};

/* -----------------------------
   UPDATE ADDRESS (FIXED ID ISSUE)
------------------------------*/
export const updateAddress = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!id) {
      return res.status(400).json({
        message: "Address ID is required",
      });
    }

    const {
      label,
      address,
      city,
      state,
      zip,
      lat,
      lng,
      isDefault,
    } = req.body;

    const existingAddress = await prisma.address.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
    });

    if (!existingAddress) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user!.id },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        label,
        address,
        city,
        state,
        zip,
        lat,
        lng,
        isDefault,
      },
    });

    return res.json({
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update address",
      error,
    });
  }
};

/* -----------------------------
   DELETE ADDRESS
------------------------------*/
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!id) {
      return res.status(400).json({
        message: "Address ID is required",
      });
    }

    const address = await prisma.address.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    await prisma.address.delete({
      where: { id },
    });

    return res.json({
      message: "Address deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete address",
      error,
    });
  }
};

/* -----------------------------
   SET DEFAULT ADDRESS
------------------------------*/
export const setDefaultAddress = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    if (!id) {
      return res.status(400).json({
        message: "Address ID is required",
      });
    }

    const address = await prisma.address.findFirst({
      where: {
        id,
        userId: req.user!.id,
      },
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    await prisma.address.updateMany({
      where: { userId: req.user!.id },
      data: { isDefault: false },
    });

    const updatedAddress = await prisma.address.update({
      where: { id },
      data: {
        isDefault: true,
      },
    });

    return res.json({
      message: "Default address updated successfully",
      address: updatedAddress,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to set default address",
      error,
    });
  }
};