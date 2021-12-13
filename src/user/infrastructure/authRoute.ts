import express from "express";

import { loginUser } from "./authController";

const router = express.Router();

router.post("/login", loginUser);

export default router;
