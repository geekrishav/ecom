import express from 'express';
import { registerController,loginController,testController,forgotPasswordController, updateProfileController,getOrdersController } from '../controllers/authController.js';
import { isAdmin, requiresSignIn } from '../middlewares/authMiddleware.js';

const router=express.Router();

router.post("/register",registerController)

router.post("/login",loginController)

router.post('/forgot-password',forgotPasswordController)

router.get('/test',requiresSignIn,isAdmin,testController)

router.get('/user-auth',requiresSignIn,(req,res)=>{
   res.status(200).json({ok:true})
})

router.get('/admin-auth',requiresSignIn,isAdmin,(req,res)=>{
   res.status(200).json({ok:true})
})

router.put('/profile',requiresSignIn,updateProfileController)

router.get('/orders',requiresSignIn,getOrdersController)

export default router;