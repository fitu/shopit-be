import { noop } from "lodash";
import { expect } from "chai";
import jwt from "jsonwebtoken";
import sinon from "sinon";

import isAuthMiddleware from "../../../src/shared/middlewares/isAuthMiddleware";

describe("isAuthMiddleware", function () {
    it("should throw an error if no authorization header is present", function () {
        const req = {
            get: noop,
        };

        expect(isAuthMiddleware.bind(this, req, {}, noop)).to.throw("Not authenticated");
    });
});
