import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";

import { ErrorHandler } from "../error/ErrorHandler";

const isAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
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
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        if (!decodedToken) {
            throw new ErrorHandler("Not authenticated", httpStatus.UNAUTHORIZED);
        }

        req.userId = decodedToken.userId;
        req.email = decodedToken.email;
    } catch (error: any) {
        throw new ErrorHandler("Not authenticated", httpStatus.UNAUTHORIZED);
    }

    next();
};

export default isAuth;
