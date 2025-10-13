import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectdb from "./config/db.js";
import router from "./routes/auth.routes.js";
import userrouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import geminiResponse from "./gemini.js"
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "https://virtual-assistant-pyqw.onrender.com",
  credentials: true,
}))

const PORT = process.env.PORT || 420;
app.use("/api/auth",router)
app.use("/api/user",userrouter)


app.get("/",async(req,res)=>{
    let prompt=req.query.prompt
    await geminiResponse(prompt).then((data)=>{
      res.status(200).json(data)
    })
  //  let data=await gaminiResponse(prompt).then((res)=>res)
    // res.status(200).json(data)
})

app.listen(PORT, () => {
  connectdb();
  console.log(`Server is running on port ${PORT}`);
});
