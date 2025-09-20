import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import PreLoginRouter from './Router/PreLoginRouter.js'
import PostLoginRouter from './Router/PostLoginRouter.js'
import dotenv from "dotenv"
dotenv.config();
const app=express()
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
)
app.use(express.urlencoded({extended:true}))
app.use("/",PreLoginRouter);
app.use("/api/home",PostLoginRouter);
const PORT=4000
app.listen(PORT,()=>{
  console.log(`Server is running on http://localhost:${PORT}`)
})