import Category from "../models/categoryModel.js";
import slugify from "slugify"

export const createCategoryController=async(req,res)=>{
   try{
      const {name}=req.body;
      if(!name){
        return res.status(404).json({message:"Name is required"});
      }

      const existingCategory=await Category.findOne({name})

      if(existingCategory){
        return res.status(200).json({message:"category already exists",success:true});
      }

      const category=await new Category({name,slug:slugify(name)}).save()

      return res.status(201).json({message:"category created",success:true,category});
      
   }
   catch(error){
    console.log(error);
    res.status(500).json({message:"Error",success:false})
   }
}

export const updateCategoryController = async(req, res) =>{
  try{
    const {name}=req.body
    const {id}=req.params
    const category = await Category.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})

    return res.status(201).json({message:"category updated",success:true,category});
  }
  catch(error){
    console.log(error)
    res.status(500).json({message:"Error in update category",success:false})
  }
}

export const categoryController=async(req,res)=>{
   try{
      const category=await Category.find({})

      return res.status(200).json({message:"categories fetched",success:true,category});      
   }
   catch(error){
    console.log(error)
    res.status(500).json({message:"Error in get all category",success:false})
   }
}

export const singleCategoryController = async(req, res)=>{
   try{
      const {slug}=req.params
      const category=await Category.findOne({slug})
      return res.status(200).json({message:"single category fetched",success:true,category});  
   }
   catch(error){
    console.log(error)
    res.status(500).json({message:"Error in fetching single category",success:false})
   }
}

export const deleteCategoryController = async(req, res)=>{
   try{
       const {id}=req.params
       await Category.findByIdAndDelete(id)
       return res.status(200).json({message:"category deleted",success:true});  

   }
   catch(error){
    console.log(error)
    res.status(500).json({message:"Error in deleting category",success:false})
   }
}