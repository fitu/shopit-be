import FileService from "@shared/integrations/files/FileService";

interface GenerateInvoiceData {
    invoicePath: string;
}

class GenerateInvoiceInteractor {
    private fileService: FileService;

    constructor(fileService: FileService) {
        this.fileService = fileService;
    }

    public async execute({ invoicePath }: GenerateInvoiceData): Promise<void> {
        await this.fileService.generateInvoice(invoicePath);
    }
}

export type { GenerateInvoiceData };
export default GenerateInvoiceInteractor;
