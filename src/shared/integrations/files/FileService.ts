import { Repository as FileRepository } from "@shared/integrations/files/Repository";

class FileService {
    constructor(private readonly fileRepository: FileRepository) {}

    public init(): void {
        this.fileRepository.init();
    }

    public async generateInvoice(invoicePath: string): Promise<void> {
        await this.fileRepository.generateInvoice(invoicePath);
    }
}

export default FileService;
