import React,{useState} from 'react'
import bg from '../assets/1684914163702.png'
import {IoEye} from 'react-icons/io5'
import { IoEyeOff } from "react-icons/io5";
import { useNavigate } from 'react-router-dom'
import { userDataContext } from '../context/UserContext.jsx'
import axios from 'axios'
import {toast, Toaster } from 'react-hot-toast';

const signup = () => {
  const {serverUrl,userData,setUserData}=React.useContext(userDataContext)
    const [showpass,setshowpass]=useState(false);
    const navigate=useNavigate()
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [loading,setLoading]=useState(false)
    const handleSignUp=async(e)=>{
      e.preventDefault();//refresh na ho
      setLoading(true)
      try {
        const result=await axios.post(`${serverUrl}/api/auth/register`,{name,email,password},{withCredentials:true})
        setUserData(result.data)
        setName("")
        setEmail("")
        setPassword("")
        navigate('/signin')
        setLoading(false)
      } catch (error) {
        toast.error(error.response.data.message)
        setUserData(null)
        setLoading(false)
        navigate("/customize")
    }
  }
  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{backgroundImage:`url(${bg})`}} >
        <form className='w-[90%] h-[600px] max-w-[500px] bg-[#0000003d] backdrop-blur shadow-lg 
        shadow-black-950 flex flex-col items-center justify-center gap-[20px] rounded-lg px-[20px]' onSubmit={handleSignUp}>
            <h1 className='text-white text-2xl font-bold mb-[30px]'>Register to <span className='text-blue-500'>Virtual Assistant</span></h1>
            <input type="text" placeholder='Enter Your Name' className='w-full h-[60px]  border-2 outline-none border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]' required onChange={(e)=>setName(e.target.value)} value={name}/>
            <input type="email" placeholder='Enter Your email' className='w-full h-[60px]  border-2 outline-none border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]' required onChange={(e)=>setEmail(e.target.value)} value={email}/>
           <div className='w-full h-[60px]  border-2 outline-none border-white bg-transparent text-white placeholder-gray-300  rounded-full text-[18px] relative flex items-center'>
            <input type={showpass?"text":"password"} placeholder='Enter Your password' className='w-full h-full rounded-full  outline-none  bg-transparent  placeholder-gray-300 px-[20px] py-[10px] ' required onChange={(e)=>setPassword(e.target.value)} value={password}/>
            {!showpass && <IoEye className='absolute right-10 top-[50%] translate-y-[-50%] text-white text-[20px] cursor-pointer' onClick={()=>setshowpass(true)}/>}
            {showpass && <IoEyeOff  className='absolute right-10 top-[50%] translate-y-[-50%] text-white text-[20px] cursor-pointer' onClick={()=>setshowpass(false)}/>}
            </div>
            <button className='min-w-[150px] h-[60px] bg-blue-700 font-semibold text-[17px] mt-[30px] text-white py-2 rounded-full cursor-pointer'disabled={loading}>{loading?"Loading...":"Sign Up"}</button>
        <p className='text-white cursor-pointer' onClick={()=>navigate('/signin')}>Already have an account? <span className='text-blue-500 cursor-pointer'>Login</span></p>
        </form>
        <Toaster 
        position="top-center"
        reverseOrder={false}/>
    </div>
  )
}

export default signup