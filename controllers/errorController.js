const get404 = (req, res, next) => {
    res.status(404).send({ message: 'Page not found' });
};

module.exports = { get404 };
