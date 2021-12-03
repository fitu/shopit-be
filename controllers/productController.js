const Product = require('../models/product');

const getProducts = async (req, res, next) => {
    const allProducts = await Product.findAll();

    res.status(200).json({ success: true, data: allProducts });
};

const getProductById = async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    res.status(200).json({ success: true, data: product });
};

const addProduct = async (req, res, next) => {
    const { title, description, price, imageUrl } = req.body;
    const newProduct = await Product.create({
        title,
        description,
        price,
        imageUrl,
    });

    res.status(200).json({ success: true, data: newProduct });
};

const removeProductById = async (req, res, next) => {
    const { id } = req.params;
    const productToDelete = await Product.findByPk(id);
    await productToDelete.destroy();

    res.status(200).json({ success: true });
};

const updateProductById = async (req, res, next) => {
    const { id } = req.params;
    const { title, description, price, imageUrl } = req.body;

    const updatedProduct = await Product.findByPk(id);
    updatedProduct.title = title;
    updatedProduct.description = description;
    updatedProduct.price = price;
    updatedProduct.imageUrl = imageUrl;
    await updatedProduct.save();

    res.status(200).json({ success: true, data: updatedProduct });
};

module.exports = { getProducts, getProductById, addProduct, removeProductById, updateProductById };
