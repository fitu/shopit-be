const getProducts = (req, res, next) => {
    res.status(200).json({ foo: 'bar' });
};

module.exports = { getProducts };
