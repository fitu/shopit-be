import { Repository as FileRepository } from "@shared/integrations/files/Repository";

class FileService {
    private fileRepository: FileRepository;

    constructor(fileRepository: FileRepository) {
        this.fileRepository = fileRepository;
    }

    public init(): void {
        this.fileRepository.init();
    }

    public async generateInvoice(invoicePath: string): Promise<void> {
        await this.fileRepository.generateInvoice(invoicePath);
    }
}

export default FileService;
