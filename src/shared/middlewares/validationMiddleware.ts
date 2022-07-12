import { Request, Response, NextFunction } from "express";
import { ValidationError, validationResult } from "express-validator";
import httpStatus from "http-status";

import { ErrorHandler } from "@shared/error/ErrorHandler";

const errorFormatter = ({ location, msg, param, value, nestedErrors }: ValidationError): string =>
    `[${param}]: ${msg}, (${value})`;

const isValid = (req: Request, res: Response, next: NextFunction) => {
    const validations = validationResult(req).formatWith(errorFormatter);

    if (!validations.isEmpty()) {
        throw new ErrorHandler(httpStatus.UNPROCESSABLE_ENTITY, validations.array());
    }

    next();
};

export default isValid;
