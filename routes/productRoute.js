const express = require('express');

const { getProducts, getProductById, addProduct, removeProductById, updateProductById } = require('../controllers/productController');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', addProduct);
router.delete('/:id', removeProductById);
router.put('/:id', updateProductById);

module.exports = router;
