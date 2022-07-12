import express from "express";

declare global {
    namespace Express {
        interface Request {
            // For authentication
            userId: string;
            email: string;

            // For i18n
            t: (message: string) => string;
        }
    }
}
