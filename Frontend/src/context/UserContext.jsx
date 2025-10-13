import React from 'react'
import axios from 'axios'
import { useState } from 'react';
export const userDataContext=React.createContext();
const UserContext = ({children}) => {
  const serverUrl="http://localhost:420"
  const [userData,setUserData]=useState(null)
    const [frontendImage,setFrontendImage]=useState(null)
    const [backendImage,setBackendImage]=useState(null)
    const [selectedImage,setSelectedImage]=useState(null)
  const handleCurrentUser=async(data)=>{
  try{
    const result =await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true})
    // console.log(result.data);
    setUserData(result.data)
    // console.log(result.data.user);
    
  }
  catch(err){
    console.log(err);
  }
  }

const getGeminiResponse=async(command)=>{
try {
  const result=await axios.post(`${serverUrl}/api/user/asktoassistant`,{command},{withCredentials:true})
  // console.log(result.data)
  
  return result.data

} catch (error) {
  console.log("Here")
  console.log(error);
}
}


  React.useEffect(()=>{
    handleCurrentUser()
  },[])
  const value={
    serverUrl,
    userData,
    setUserData,  
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse
  }
  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  )
}

export default UserContext