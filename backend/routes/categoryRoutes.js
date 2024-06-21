import express from 'express';
import { isAdmin, requiresSignIn } from '../middlewares/authMiddleware.js';
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from '../controllers/categoryController.js';

const router=express.Router();

router.post('/create-category',requiresSignIn,isAdmin,createCategoryController)

router.put('/update-category/:id',requiresSignIn,isAdmin,updateCategoryController)

router.get('/get-all-category',categoryController)

router.get('/single-category/:slug',singleCategoryController)

router.delete('/delete-category/:id',requiresSignIn,isAdmin,deleteCategoryController);


export default router;