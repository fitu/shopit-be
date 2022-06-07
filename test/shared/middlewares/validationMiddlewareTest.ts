import { NextFunction, Request, Response } from "express";
import { noop } from "lodash";
import { expect } from "chai";

import middleware from "../../../src/shared/middlewares/validationMiddleware";

describe("validationMiddleware", function () {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        res = {};
        next = noop;
    });

    it("should pass without throwing any exception if there were no errors", function () {
        // Then
        expect(middleware.bind(this, req, res, next))
    });
});