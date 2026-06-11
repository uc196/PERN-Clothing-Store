import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


 const auth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const token = authHeader.split(" ")[1];
        // Here you would typically verify the token and extract user information
        // For example, using JWT:
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // req.user = decoded; // Attach user info to request object
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export default auth;