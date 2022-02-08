import fs from "fs/promises";
import path from "path";

import { Router, Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import { param } from "express-validator";
import PDFDocument from "pdfkit";

import isAuth from "../../shared/middlewares/isAuth";
import Controller from "../../shared/Controller";

class OrderController implements Controller {
    public path = "/orders";
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = (): void => {
        this.router.get(this.path, isAuth, this.getOrders);
        this.router.get(this.path, isAuth, this.getOrders);
        this.router.get(`${this.path}/:id/invoice`, isAuth, param("id").notEmpty().isUUID(), this.getInvoice);
    };

    private getOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        res.status(httpStatus.OK).json({ success: true, data: [] });
    };

    private getInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;

        const pdf = new PDFDocument();

        // TODO: move this out of controller
        const invoiceName = "invoice-" + id + ".pdf";
        const invoicePath = path.join("data", "invoices", invoiceName);
        const invoiceFile = await fs.open(invoicePath, "a");

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);

        pdf.pipe(invoiceFile.createWriteStream());
        pdf.pipe(res);

        pdf.fontSize(26).text("This is a PDF example!", { underline: true });
        pdf.text("-----------------------");

        pdf.fontSize(20).text("Total Price: $ XX.XX");
        pdf.end();
    };

    private createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        res.status(httpStatus.OK).json({ success: true, data: [] });
    };
}

export default OrderController;
