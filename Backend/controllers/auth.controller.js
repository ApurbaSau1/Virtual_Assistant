import gettoken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
export const signup = async (req, res) => {
try{
    const {name,email,password}=req.body;
    
    
    if(!name || !email || !password){
        return res.status(400).json({message:"Please fill all the fields"})
    }
    
    const existingUser=await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message:"User already exists"})
    }
    if(password.length<6){
        return res.status(400).json({message:"Password must be at least 6 characters"})
    }
    const hashedPassword=await bcrypt.hash(password,10); // TODO: Hash the password before saving to database
    const user=await User.create({name,email,password:hashedPassword});
   
    const token=await gettoken(user._id);
    res.cookie("token",token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000, // 7 days
        sameSite:"None",
        secure:true
    })
    
    // await newUser.save();
    return res.status(200).json({user,message:"User created successfully"})

}
catch(err){
    console.log(err);
    return res.status(500).json({message:"Server Error"})
}

}

// Login Controller
export const login = async (req, res) => {
try{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(400).json({message:"Please fill all the fields"})
    }
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({message:"User not exists"})
    }
    const isPasswordCorrect=await bcrypt.compare(password,user.password);
    // console.log(user.password);
    
    if(!isPasswordCorrect){
        return res.status(400).json({message:"Wrong Password"})
    }
    
    const token=await gettoken(user._id);
    res.cookie("token",token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000, // 7 days
        sameSite:"None",
        secure:true
    })
    return res.status(200).json({user,message:"Login successful"})


}
catch(err){
    // console.log(err);
    return res.status(500).json({message:"login Error"})
}

}


//log out controller

export const logout = async (req, res) => {
try{
res.clearCookie("token")
return res.status(200).json({message:"Logout successful"})
}
catch(err){
    // console.log(err);
    return res.status(500).json({message:"Logout Error"})
}
}
