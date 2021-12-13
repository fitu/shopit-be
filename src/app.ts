import { Application, Request, Response, NextFunction } from "express";
import path from "path";
import express from "express";

import { handleAppErrors } from "./controllers/errorController";
import productRoutes from "./routes/productRoute";
import authRoutes from "./routes/authRoute";
import cartRoutes from "./routes/cartRoute";
import orderRoutes from "./routes/orderRoute";

// Init
const app: Application = express();

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/v1/products", productRoutes);
app.use("/api/v1", authRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use(handleAppErrors);

export default app;
