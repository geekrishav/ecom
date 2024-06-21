import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js"
import fs from "fs"
import slugify from "slugify";
import braintree from "braintree"
import dotenv from "dotenv"
import Order from "../models/orderModel.js";

dotenv.config({
   path:".env"
});

var gateway = new braintree.BraintreeGateway({
   environment: braintree.Environment.Sandbox,
   merchantId: process.env.MerchantID,
   publicKey: process.env.PublicKey,
   privateKey: process.env.PrivateKey,
 });

export const createProductController =async(req,res)=>{
  try{
    const {name,description,price,slug,category,shipping,quantity}=req.fields

    if(!name || !description || !price || !category || !quantity){
       return res.status(500).json({message:"Fill all fields",success:false})
    }

    const {photo}=req.files

    if(!photo && photo.size>1000000){
       return res.status(500).json({message:"Photo is required",success:false})
    }

    const product=new Product({...req.fields,slug:slugify(name)})

    if(photo){
        product.photo.data=fs.readFileSync(photo.path)
        product.photo.contentType=photo.type
    }

    await product.save()

    return res.status(200).json({message:"product created",success:true,product});  
  }
  catch(error){
    console.log(error)
    res.status(500).json({message:"Error in creating product",success:false})
  }
}

export const getProductController=async(req,res)=>{
   try{
      const products=await Product.find({}).populate('category').select("-photo").limit(12).sort({createdAt:-1})

      return res.status(200).json({message:"all products fetched",countTotal:products.length,success:true,products});  
   }
   catch(error){
    console.log(error)
    res.status(500).json({message:"Error in fetching product",success:false})
   }
}

export const getSingleProductController = async(req, res) =>{
    try{
       const product=await Product.findOne({slug:req.params.slug}).select('-photo').populate('category')
       return res.status(200).json({message:"product fetched",success:true,product});  
    }
    catch(error){
    console.log(error)
    res.status(500).json({message:"Error in fetching single product",success:false})
    }
}

export const getProductPhotoController = async(req, res) =>{
   try{
     const product=await Product.findById(req.params.pid).select("photo")

     if(product.photo.data){
        res.set('Content-type',product.photo.contentType);
        return res.status(200).json({message:"Products",success:true,data:product.photo.data});
     }
   }
   catch(error){
    console.log(error)
    res.status(500).json({message:"Error in fetching photo",success:false})
   }
}

export const deleteProductController = async(req, res) => {
   try{
    const {pid}=req.params
    await Product.findByIdAndDelete(pid)
    return res.status(200).json({message:"Product deleted",success:true});
   }
   catch(error){
    console.log(error);
    res.status(500).json({message:"Error in deleting product",success:false})
   }
}

export const updateProductController = async(req, res) => {
   try{
    const {name,description,slug,price,category,shipping,quantity}=req.fields

    if(!name || !description || !price || !category || !quantity){
       return res.status(500).json({message:"Fill all fields",success:false})
    }

    const {photo}=req.files

    if(!photo){
       return res.status(500).json({message:"Photo is required",success:false})
    }

    const product=await Product.findByIdAndUpdate(req.params.pid,{
        ...req.fields,slug:slugify(name)
    },{new:true})
    
    if(photo && photo.size>10000000){
        product.photo.data=fs.readFileSync(photo.path)
        product.photo.contentType=photo.type
    }

    await product.save()

    return res.status(200).json({message:"product updated",success:true,product});  
   }
   catch(error){
    console.log(error);
    res.status(500).json({message:"Error in updating product",success:false})
   }
}

export const productFilterController=async(req,res)=>{
   try{
      const {checked,radio}=req.body

      let args={}

      if(checked.length>0){
          args.category=checked
      }

      if(radio.length>0){
         args.price={$gte:radio[0],$lte:radio[1]}
      }

      const products=await Product.find(args)

      return res.status(200).json({message:"filtered product",success:true,products});  
   }
   catch(error){
    console.log(error);
    res.status(500).json({message:"Error in filtering product",success:false})
   }
}

export const productCountController=async(req,res)=>{
   try{
      const total=await Product.find({}).estimatedDocumentCount()

      return res.status(200).json({message:"product count fetched",success:true,total});  
   }
   catch(error){
    console.log(error);
    res.status(500).json({message:"Error in product count",success:false})
   }
}

export const productListController=async(req,res)=>{
   try{
     const perPage=3;
     const page=req.params.page ? req.params.page : 1;
     const products=await Product.find({}).select("-photo").skip((page-1)*perPage).limit(perPage).sort({createdAt:-1})

     return res.status(200).json({message:"product list fetched",success:true,products});  
   }
   catch(error){
    console.log(error);
    res.status(500).json({message:"Error in product list",success:false})
   }
}

export const searchController=async(req,res)=>{
   try{
      const {keyword}=req.params

      const product=await Product.find({
         
//          It uses the Mongoose find() method to search for products in the database.
// The search is performed based on two criteria:
// The product name (name) must match the keyword using a case-insensitive regular expression ($regex: keyword, $options: "i").
// The product description (description) must also match the keyword using a case-insensitive regular expression.
// The $or operator specifies that the search should match either the product name or the product description.

         $or:[
            {name:{$regex:keyword,$options:"i"}},
            {description:{$regex:keyword,$options:"i"}},
         ]
      }).select("-photo")

      return res.status(200).json({message:"searched product fetched",success:true,product});  
   }
   catch(error){
      console.log(error);
    res.status(500).json({message:"Error in search function",success:false})
   }
}

export const relatedProductController=async(req,res)=>{
  try{
     const {pid,cid}=req.params

     const products=await Product.find({
      category:cid,
      _id:{$ne:pid}
     }).select("-photo").limit(3).populate("category")

     return res.status(200).json({message:"related product fetched",success:true,products}); 

  }
  catch(error){
   console.log(error)
   res.status(500).json({message:"Error in related product function",success:false})
  }
}

export const productCategoryController=async(req,res)=>{
    try{
      const category=await Category.findOne({slug:req.params.slug})

      const products=await Product.find({category}).populate('category')

      return res.status(200).json({message:" product from category are fetched",success:true,products,category}); 
    }
    catch(error){
      console.log(error)
      res.status(500).json({message:"Error in product category function",success:false})
    }
}

export const braintreeTokenController = async (req, res) => {
   try {
     gateway.clientToken.generate({}, function (err, response) {
       if (err) {
         res.status(500).send(err);
       } else {
         res.send(response);
       }
     });
   } catch (error) {
     console.log(error);
   }
 };

 export const brainTreePaymentController = async (req, res) => {
   try {
     const { nonce, cart } = req.body;
     let total = 0;
     cart.map((i) => {
       total += i.price;
     });
     let newTransaction = gateway.transaction.sale(
       {
         amount: total,
         paymentMethodNonce: nonce,
         options: {
           submitForSettlement: true,
         },
       },
       function (error, result) {
         if (result) {
          console.log("andar iske")
           const order = new Order({
             products: cart,
             payment: result,
             buyer: req.user._id,
           }).save();
           res.json({ ok: true });
         } else {
           res.status(500).send(error);
         }
       }
     );
   } catch (error) {
     console.log(error);
   }
 };
