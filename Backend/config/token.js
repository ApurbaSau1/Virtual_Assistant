import jwt from 'jsonwebtoken'
const gettoken =async(userId)=>{
try {
    const token=await jwt.sign({userId},process.env.jwt_secret,{expiresIn:"7d"})
    return token;
} catch (error) {
    console.log(error)
}
}
export default gettoken