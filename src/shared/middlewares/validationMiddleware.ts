import { Request, Response, NextFunction } from "express";
import { ValidationError, validationResult } from "express-validator";
import httpStatus from "http-status";

import { ErrorHandler } from "../error/ErrorHandler";

const errorFormatter = ({ location, msg, param, value, nestedErrors }: ValidationError): string => `[${param}]: ${msg}, (${value})`;

// TODO: do not hardcode this
const isValid = (req: Request, res: Response, next: NextFunction) => {
    const validations = validationResult(req).formatWith(errorFormatter);
    if (!validations.isEmpty()) {
        throw new ErrorHandler('Validation error', httpStatus.UNPROCESSABLE_ENTITY, validations.array());
    }

    next();
};

export default isValid;
