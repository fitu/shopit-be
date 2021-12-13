import { Server } from 'http';

class ErrorHandler extends Error {
    statusCode: number;

    constructor(public message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

const handleGeneralErrors = (server: Server): void => {
    process.on('uncaughtException', (err: Error) => {
        console.log(`Error; ${err.message}`);
        console.log(`Shutting down the server due to Uncaught exception`);
        server.close(() => process.exit(1));
    });

    process.on('unhandledRejection', (err: Error): void => {
        console.log(`Error; ${err.message}`);
        console.log(`Shutting down the server due to Unhandled promise rejection`);
        server.close(() => process.exit(1));
    });
};

module.exports = {
    ErrorHandler,
    handleGeneralErrors,
};

export {};
