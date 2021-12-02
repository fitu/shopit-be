const app = require('./app');
const { handleGeneralErrors } = require('./utils/errors');

// TODO: use another file for production, not env vars
// FIXME: this is not working
if (process.env.NODE_ENV !== 'PRODUCTION') {
    const dotenv = require('dotenv');
    dotenv.config();
}

// DB
const db = require('./utils/database');
db.sync()
    .then(() => {
        const server = app.listen(process.env.PORT, () => {
            console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
        });

        handleGeneralErrors(server);
    })
    .catch((error) => console.log(error));
