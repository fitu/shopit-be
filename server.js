const app = require('./app');
const { handleErrors } = require('./utils/handleErrors');

const server = app.listen(3000, () => {
    console.log('Server started on port 3000 in DEVELOP mode');
});

handleErrors(server);
