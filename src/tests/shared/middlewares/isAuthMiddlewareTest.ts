import { NextFunction, Request, Response } from "express";
import { noop } from "lodash";
import { expect } from "chai";
import jwt from "jsonwebtoken";
import sinon from "sinon";

import middleware from "@shared/middlewares/isAuthMiddleware";

describe("isAuthMiddleware", function () {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        res = {};
        next = noop;
    });

    it("should throw an error if no authorization header is present", function () {
        // Then
        expect(middleware.bind(this, req, res, next)).to.throw();
    });

    it("should throw an error if the authorization header is only one string", function () {
        // Given
        req = {
            headers: {
                authorization: 'foo',
            },
        };

        // Then
        expect(middleware.bind(this, req, res, next)).to.throw();
    });

    it("should yield a userId and email after decoding the token", function () {
        // Given
        req = {
            headers: {
                authorization: 'Bearer foo',
            },
        };

        sinon.stub(jwt, 'verify');
        jwt.verify.returns({ userId: 'foo', email: 'foo@bar.com' });

        const nextSpy = sinon.spy(next);

        // When
        middleware(req as Request, res as Response, nextSpy as any);

        // Then
        expect(jwt.verify.called).to.be.true;
        expect(req).to.have.property('userId', 'foo');
        expect(req).to.have.property('email', 'foo@bar.com');
        expect(nextSpy.called).to.be.true;

        jwt.verify.restore();
    });
});