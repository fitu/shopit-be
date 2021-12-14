import { Server } from "http";

import { initializeDB } from "./shared/db/database";
import validateEnv from "./shared/env/envUtils";
import { handleGeneralErrors } from "./shared/error/errors";
import app from "./app";

(async () => {
    try {
        // Validate env before start
        const env = validateEnv();

        // Connect to DB
        await initializeDB(env);

        // Create the server and start listening for connections
        const server: Server = app.listen(process.env.PORT, () => {
            console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
        });

        handleGeneralErrors(server);
    } catch (error) {
        console.error("Error while connecting to the database", error);
        return error;
    }
})();
