import express from 'express';
import User from '../models/userModel.js'
import { comparePassword, hashPassword } from '../helpers/authHelper.js';
import jwt from 'jsonwebtoken'
import Order from '../models/orderModel.js'
import dotenv from "dotenv";

dotenv.config({
   path:".env"
})

const registerController=async(req,res)=>{
   try{
      const {name,password,email,phone,address,question}=req.body;

      if(!name || !password || !email || !phone || !address || !question){
        return res.status(500).json({message:"Fill all fields",success:false})
      }

      const user=await User.findOne({email:email});

      if(user){
         return res.status(500).json({message:"User already registered",success:false})
      }

      const hashedPassword=await hashPassword(password)

      const newUser =await User.create({name:name,password:hashedPassword,email:email,phone:phone,address:address,question:question})

      await newUser.save()

      res.status(200).json({message:"register successfully",success:true,newUser}) 
   }
   catch(error){
     console.log(error)
     res.status(500).json({message:"Error in register",success:false})
   }
}

const loginController=async(req,res)=>{
   try{
      const {email,password}=req.body;

      const user=await User.findOne({email:email})

      if(!user){
         return res.status(400).json({message:"User not found",success:false})
      }

      const match=await comparePassword(password,user.password)
      
      if(!match){
         return res.status(400).json({message:"Invalid email or password",success:false})
      }

      const token=jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"})

      res.status(200).json({message:"logged in successfully",success:true,token,user})
   }
   catch(error){
      console.log(error)
      res.status(500).json({message:"Error in login",success:false})
   }

}

const forgotPasswordController=async(req,res)=>{
   try{
      const {email,question,newPassword} = req.body

      if(!email){
         return res.status(400).json({message:"Email is required",success:false})
      }

      if(!question){
         return res.status(400).json({message:"Question is required",success:false})
      }

      if(!newPassword){
         return res.status(400).json({message:"New password is required",success:false})
      }

      const user=await User.findOne({email,question})

      if(!user){
         return res.status(400).json({message:"Wrong email or question",success:false})
      }

      const hashed=await hashPassword(newPassword)

      await User.findByIdAndUpdate(user._id,{password:hashed})

      res.status(200).json({message:"Password reset successfully",success:true})
   }
   catch(error){
      res.status(500).json({message:"Error in forgot password",success:false})
      console.log(error)
   }
}

const testController=(req,res)=>{
   res.send({message:"hello world"})
}

const updateProfileController=async(req,res)=>{
     try{

      const {name,email,password,address,phone}=req.body;

      const user=await User.findById(req.user._id)

      if(password && password.length<4){
         return res.status(400).json({message:"Password not valid",success:false})
      }

      const hashedPassword=password ? await hashPassword(password) : undefined

      const updatedUser=await User.findByIdAndUpdate(req.user._id,{
         name:name || user.name,
         password:hashedPassword || user.password,
         phone:phone || user.phone,
         email:email || user.email,
         address:address || user.address
      },{new:true})

      res.status(200).json({message:"User updated successfully",success:true,updatedUser})

     }
     catch(error){
      res.status(500).json({message:"Error in updating profile",success:false})
      console.log(error)
     }
}

const getOrdersController=async(req,res)=>{
     try{
      const orders = await Order
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
      return res.json(orders)
     }
     catch(error){
      res.status(500).json({message:"Error in fetching user orders",success:false})
      console.log(error)
     }
}

export {registerController,loginController,testController,forgotPasswordController,updateProfileController,getOrdersController}