import httpStatus from "http-status";
import jwt from "jsonwebtoken";

import { ErrorHandler } from "../error/ErrorHandler";

// TODO: check strings
// TODO: check status codes
const isAuth = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        const error = new ErrorHandler("Not authenticated", 401);
        throw error;
    }

    // Remove token type: "Bearer foo" -> "foo"
    const token = authHeader.split(" ")[1];
    const JWT_SECRET = process.env.JWT;
    const decodedToken = jwt.verify(token, JWT_SECRET);
    if (!decodedToken) {
        const error = new ErrorHandler("Not authenticated", 401);
        throw error;
    }

    req.email = decodedToken.email;
    next();
};

export default isAuth;
