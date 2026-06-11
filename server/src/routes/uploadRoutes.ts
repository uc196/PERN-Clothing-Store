import Express from "express";
import  auth  from "../middleware/auth.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadRouter = Express.Router();

uploadRouter.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const dataURI =
      "data:" +
      req.file.mimetype +
      ";base64," +
      req.file.buffer.toString("base64");

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "products",
      resource_type: "image",
    });

    return res.json({ url: result.secure_url });
  } catch (error) {
    return res.status(500).json({ message: "Upload failed", error });
  }
});

export default uploadRouter;