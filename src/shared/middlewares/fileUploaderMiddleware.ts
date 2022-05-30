import multer, { Multer } from "multer";

const fileUpload = (...args: any): Multer => {
    return multer(...args);
};

interface MulterRequest extends Request {
    files: any;
}

export type { MulterRequest };
export default { fileUpload,  };