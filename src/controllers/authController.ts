import { Request, Response, NextFunction } from "express";

const loginUser = (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({ success: true });
};

export { loginUser };
