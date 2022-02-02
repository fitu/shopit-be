import httpStatus from "http-status";
import jwt from "jsonwebtoken";

import { ErrorHandler } from "../error/ErrorHandler";

// TODO: check strings
// TODO: check status codes
const isAuth = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        throw new ErrorHandler("Not authenticated", 401);
    }

    // Token example: "Bearer foo"
    const tokenWithType = authHeader.split(" ");
    if (tokenWithType.length <= 1) {
        throw new ErrorHandler("Not authenticated", 401);
    }

    const token = tokenWithType[1];
    const JWT_SECRET = process.env.JWT;
    const decodedToken = jwt.verify(token, JWT_SECRET);
    if (!decodedToken) {
        throw new ErrorHandler("Not authenticated", 401);
    }

    req.email = decodedToken.email;
    next();
};

export default isAuth;
