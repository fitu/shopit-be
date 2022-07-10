import fs from "fs/promises";

import PDFDocument from "pdfkit";

import { Repository } from "./Repository";

class PDFRepository implements Repository {
    private pdf: PDFDocument;

    public init(): void {
        this.pdf = new PDFDocument();
    }

    // TODO: improve order generation
    // TODO: remove hardcoded
    public async generateInvoice(invoicePath: string): Promise<void> {
        const invoiceFile = await fs.open(invoicePath, "a");
        const writeStream = invoiceFile.createWriteStream();

        this.pdf.pipe(writeStream);

        this.pdf.fontSize(26).text("This is a PDF example!", { underline: true });
        this.pdf.text("-----------------------");

        this.pdf.fontSize(20).text("Total Price: $ XX.XX");
        this.pdf.end();
    }
}

export default PDFRepository;
