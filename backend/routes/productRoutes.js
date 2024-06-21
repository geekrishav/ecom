import express from "express"
import { isAdmin, requiresSignIn } from "../middlewares/authMiddleware.js";
import { createProductController, deleteProductController, getProductController, getProductPhotoController, getSingleProductController, updateProductController,productFilterController, productCountController ,productListController, searchController, relatedProductController, productCategoryController, braintreeTokenController, brainTreePaymentController } from "../controllers/productController.js";
import formidable from "express-formidable";


const router=express.Router()

router.post('/create-product',requiresSignIn,isAdmin,formidable(),createProductController)

router.get('/get-products',getProductController)

router.get('/get-product/:slug',getSingleProductController)

router.get('/product-photo/:pid',getProductPhotoController)

router.delete('/delete-product/:pid',deleteProductController)

router.put('/update-product/:pid',requiresSignIn,isAdmin,formidable(),updateProductController)

router.post('/product-filter',productFilterController)

router.get('/product-count',productCountController)

router.get('/product-list/:page',productListController)

router.get('/search/:keyword',searchController)

router.get('/related-product/:pid/:cid',relatedProductController)

router.get('/product-category/:slug',productCategoryController)

router.get("/braintree/token",braintreeTokenController)

router.post('/braintree/payment',requiresSignIn,brainTreePaymentController)


export default router;