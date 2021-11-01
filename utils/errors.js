class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

const handleGeneralErrors = (server) => {
    process.on('uncaughtException', (err) => {
        console.log(`Error; ${err.message}`);
        console.log(`Shutting down the server due to Uncaught exception`);
        server.close(() => process.exit(1));
    });

    process.on('unhandledRejection', (err) => {
        console.log(`Error; ${err.message}`);
        console.log(`Shutting down the server due to Unhandled promise rejection`);
        server.close(() => process.exit(1));
    });
};

module.exports = {
    ErrorHandler,
    handleGeneralErrors,
};
