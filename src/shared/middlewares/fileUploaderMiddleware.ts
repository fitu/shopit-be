import multer, { Multer } from "multer";

const fileUpload = (...args: any): Multer => {
    return multer(...args);
};

export default fileUpload;