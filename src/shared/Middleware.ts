import { Application } from "express";

interface Middleware {
    init: (app: Application) => Promise<void>;
}

export default Middleware;
