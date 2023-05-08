import express from "express";

import{
    getProduct,
    getProductByld,
    createProduct,
    deleteProduct,
    updateProduct,
}from"../controles/productcontroles.js";

const router =  express.Router()

router.get('/products',getProduct);
router.get('/product/:id',getProductByld);
router.post('/product',createProduct);
router.patch('/product/:id',updateProduct);
router.delete('/product/:id',deleteProduct)

export default router;