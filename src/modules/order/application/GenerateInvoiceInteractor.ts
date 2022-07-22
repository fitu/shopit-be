import FileService from "@shared/integrations/files/FileService";

type GenerateInvoiceData = {
    readonly invoicePath: string;
};

class GenerateInvoiceInteractor {
    constructor(private readonly fileService: FileService) {}

    public async execute({ invoicePath }: GenerateInvoiceData): Promise<void> {
        await this.fileService.generateInvoice(invoicePath);
    }
}

export type { GenerateInvoiceData };
export default GenerateInvoiceInteractor;
