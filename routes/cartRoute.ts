const express = require('express');

const { getCart, addProductToCart, deleteProductFromCart } = require('../controllers/cartController');

const router = express.Router();

router.get('/', getCart);
router.post('/', addProductToCart);
router.delete('/', deleteProductFromCart);

module.exports = router;

export {};
