import express from 'express';
import dotenv from "dotenv"
import connectDB from './config/db.js';
import authRouter from './routes/authRoute.js'
import categoryRouter from './routes/categoryRoutes.js'
import productRouter from './routes/productRoutes.js'
import cors from "cors"

dotenv.config({
    path:".env"
})

connectDB()
const app = express();
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials:"true"
}))
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/category",categoryRouter)
app.use("/api/v1/product",productRouter)

app.get('/',(req,res)=>{
   res.send({
    message:"Welcome to app"
   })
})

const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log('listening on port '+PORT)
})