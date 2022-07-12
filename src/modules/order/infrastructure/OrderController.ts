import osPath from "path";
import fs from "fs";

import { Router, Request, Response, NextFunction } from "express";
import { param } from "express-validator";

import Controller from "@shared/controllers/Controller";
import FileService from "@shared/integrations/files/FileService";
import GenerateInvoiceInteractor, { GenerateInvoiceData } from "@order/application/GenerateInvoiceInteractor";

const BASE_FILENAME = "invoice";
const BASE_FOLDER = "data";
const INVOICES_FOLDER_NAME = "invoices";
const FILE_EXTENTION = "pdf";

class OrderController implements Controller {
    /*
     * Variables and constructor
     */

    public path = "/orders";
    public router = Router();

    private fileService: FileService;

    constructor(fileService: FileService) {
        this.fileService = fileService;

        this.initializeRoutes();
    }

    /*
     * Route's validations
     */

    private validations = {
        getInvoiceOne: [param("id").notEmpty().isUUID()],
    };

    /*
     * Routes
     */

    private initializeRoutes = (): void => {
        this.router.get(`${this.path}/:id/invoice`, this.validations.getInvoiceOne, this.getInvoice);
    };

    // FIXME: this doesn't always work
    private getInvoice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { id } = req.params;
        const invoiceFileName = `${BASE_FILENAME}-${id}.${FILE_EXTENTION}`;
        const invoicePath = osPath.join(BASE_FOLDER, INVOICES_FOLDER_NAME, invoiceFileName);
        const data: GenerateInvoiceData = { invoicePath };

        try {
            const interactor = new GenerateInvoiceInteractor(this.fileService);
            await interactor.execute(data);

            const file = fs.createReadStream(invoicePath);
            const { size } = fs.statSync(invoicePath);

            res.setHeader("Content-Length", size);
            res.setHeader("Content-Type", `application/${FILE_EXTENTION}`);
            res.setHeader("Content-Disposition", `inline; filename="${invoiceFileName}"`);

            file.pipe(res);
        } catch (error: any) {
            next(new Error(error));
        }
    };
}

export default OrderController;
