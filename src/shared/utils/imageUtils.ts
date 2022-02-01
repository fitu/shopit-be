import { Request } from "express";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";

const IMAGES_FOLDER_NAME = "images";
const IMAGES_MIMETYPE_ACCEPTED = ["image/png","image/jpg", "image/jpeg"];

const generateImageUploaderConfig = (): any => {
    type DestinationCallback = (error: Error | null, destination: string) => void;
    type FileNameCallback = (error: Error | null, filename: string) => void;

    const storage = multer.diskStorage({
        destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback) => {
            cb(null, IMAGES_FOLDER_NAME);
        },
        filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
            const IMAGE_NAME_PREFIX = uuidv4();
            const IMAGE_NAME_DELIMITER = "-";
            const uniqueNameToSave = `${IMAGE_NAME_PREFIX}${IMAGE_NAME_DELIMITER}${file.originalname}`;
            cb(null, uniqueNameToSave);
        },
    });

    type FileFilterCallback = (error: Error | null, accepted: boolean) => void;
    const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        const accepted = IMAGES_MIMETYPE_ACCEPTED.includes(file.mimetype);
        cb(null, accepted);
    };

    return { storage, fileFilter };
};

export { IMAGES_FOLDER_NAME, generateImageUploaderConfig };
