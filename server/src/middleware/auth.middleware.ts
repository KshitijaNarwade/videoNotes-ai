import { type Request, type Response, type NextFunction } from "express";
import jwt, { type JwtPayload as JWTJwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

interface AuthJwtPayload extends JWTJwtPayload {
  userId: string;
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Authentication token is missing",
      });
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET is not configured");

      return res.status(500).json({
        message: "Server configuration error",
      });
    }

    const decoded = jwt.verify(token, secret) as AuthJwtPayload;

    req.user = {
      _id: new mongoose.Types.ObjectId(decoded.userId),
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
