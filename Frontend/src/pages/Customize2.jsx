import React, { useContext, useState } from 'react'
import { userDataContext } from '../context/usercontext'
import { IoChevronBackSharp } from "react-icons/io5";

import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const Customize2 = () => {
  const {userData,backendImage,selectedImage,serverUrl,setUserData}=useContext(userDataContext)
  const [assistantName,setAssistantName] =useState(userData?.assistantName || "")
  const [loading,setloading]=useState(false)
  const navigate=useNavigate()
  const handleUpdateAssistant=async()=>{
    setloading(true)
    try {
      let formData=new FormData()
      formData.append("assistantName",assistantName)
      if(backendImage){
        formData.append("assistantImage",backendImage)
      }
      else{
        formData.append("imageUrl",selectedImage)
      }
      const result=await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true})
      // console.log(result.data.user)
      setUserData(result.data)
      setloading(false)
      window.location.reload()
      navigate("/")
    } catch (error) {
      console.log(error);
      setloading(false)
    }
  }
  return (
     <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353]  
    flex justify-center items-center flex-col p-[20px] relative'>
      <IoChevronBackSharp className='text-white absolute top-[20px] left-[20px] cursor-pointer ' onClick={()=>{navigate(-1)}}/>
    <h1 className='text-white text-[30px] text-center mb-[25px]'> Enter Your <span className='text-blue-500'>Assistant Name</span></h1>
    
    <input type="text" placeholder='eg: Montu' className='w-full max-w-[600px] h-[60px] 
    border-2 outline-none border-white bg-transparent text-white placeholder-gray-300 px-[20px] 
    py-[10px] rounded-full text-[18px]' required value={assistantName} onChange={(e)=>setAssistantName(e.target.value)}/>
    
    {assistantName && <button  className='min-w-[250px] h-[60px] bg-blue-700 font-semibold text-[17px] mt-[30px] text-white py-2 rounded-full cursor-pointer'
      disabled={loading}
      onClick={()=>{handleUpdateAssistant()
      }}>{!loading ? "Finally Create Your Assistant" : "Creating..."}</button>}
    </div>
  )
}

export default Customize2