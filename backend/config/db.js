import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config({
    path:".env"
})

const connectDB=async()=>{
  try{
    const DB_URL=process.env.DB_URL;

    await mongoose.connect(DB_URL)

    console.log("Connected to MongoDB");
  }
  catch(error){
     console.log("Error connecting to MongoDb "+error)
  }
}

export default connectDB;