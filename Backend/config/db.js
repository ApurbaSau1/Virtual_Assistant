import mongoose from "mongoose"

const connectdb=async()=>{
    try{
        await mongoose.connect(process.env.MongoDB_URL)
        console.log("MongoDB connected")
    }
    catch(err){
        console.log(err)
    }
}

export default connectdb