import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";

import { ErrorHandler } from "../error/ErrorHandler";

// TODO: should I use a type here?
const isAuth = (req: Request & { userId: string; email: string }, res: Response, next: NextFunction) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        throw new ErrorHandler("Not authenticated", httpStatus.UNAUTHORIZED);
    }

    // Token example: "Bearer foo"
    const tokenWithType = authHeader.split(" ");
    if (tokenWithType.length <= 1) {
        throw new ErrorHandler("Not authenticated", httpStatus.UNAUTHORIZED);
    }

    const token = tokenWithType[1];
    const JWT_SECRET = process.env.JWT;
    const decodedToken = jwt.verify(token, JWT_SECRET);
    if (!decodedToken) {
        throw new ErrorHandler("Not authenticated", httpStatus.UNAUTHORIZED);
    }

    req.userId = decodedToken.userId;
    req.email = decodedToken.email;
    next();
};

export default isAuth;
