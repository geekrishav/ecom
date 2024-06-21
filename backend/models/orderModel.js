import mongoose from 'mongoose';

const orderSchema=new mongoose.Schema({
   products:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    }
   ],
   payment:{},
   buyers:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
   },
   status:{
    type:String,
    default:'Not Process',
    enum:['Not Process',"Processing","Shipped","Delivered","Cancel"]
   }
},{timestamps:true});

const Order=mongoose.model('Order',orderSchema);

export default Order;

