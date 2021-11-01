const app = require('./app');
const { handleGeneralErrors } = require('./utils/errors');

const server = app.listen(3000, () => {
    console.log('Server started on port 3000 in DEVELOP mode');
});

handleGeneralErrors(server);
