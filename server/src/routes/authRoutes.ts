import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
} from "../controllers/authControllers";

import auth from "../middleware/auth";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/profile", auth, getProfile);
export default authRouter;