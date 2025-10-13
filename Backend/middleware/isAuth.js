import jwt from 'jsonwebtoken'
const isAuth=async(req,res,next)=>{
    try {
        const token=req.cookies.token
        if(!token){
            return res.status(400).json({message:"token not found"})
        }
        const decoded=await jwt.verify(token,process.env.jwt_secret)
        req.userId=decoded.userId
        next()
    } catch (error) {
        res.status(500).json({message:"Internal Server Error"})
    }
}
export default isAuth
   

