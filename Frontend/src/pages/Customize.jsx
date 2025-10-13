import {React,  useRef, useState,useContext } from 'react'
import Card from '../components/Card'
import image1 from '../assets/image1.jpg'
import image2 from '../assets/image2.jpg'
import image3 from '../assets/image3.jpg'
import image4 from '../assets/1684914163702.png'
import { LuImageUp } from "react-icons/lu";
import { userDataContext } from '../context/usercontext'
import { useNavigate } from 'react-router-dom'
import { IoChevronBackSharp } from "react-icons/io5";

const Customize = () => {

  const{serverUrl,
    userData,
    setUserData,  
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage}=useContext(userDataContext)

    const navigate=useNavigate()
  const inputImage=useRef()

  const handleImage=(e)=>{
    const file=e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }
  return (
    <div className='w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353]  
    flex justify-center items-center flex-col p-[20px] '>
            <IoChevronBackSharp className='text-white absolute top-[20px] left-[20px] cursor-pointer ' onClick={()=>{navigate("/")
              window.location.reload()
            }}/>
      
      <h1 className='text-white text-[30px] text-center mb-[25px]'> Select Your <span className='text-blue-500'>Assistant Image</span></h1>
      <div className='w-[90%] max-w-[900px] flex justify-between items-center 
      flex-wrap overflow-hidden gap-[15px]'>
      <Card image={image1}/>
      <Card image={image2}/>
      <Card image={image3}/>
      <Card image={image4}/>
       <div className={`w-[80px] h-[160px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[blue] rounded-2xl  overflow-hidden hover:shadow-blue-950
        cursor-pointer hover:border-4 hover:border-white flex justify-center
         items-center${selectedImage === "inputImage" ? 'border-4 border-white' : ''}`} onClick={()=>{inputImage.current.click()
         setSelectedImage("inputImage")
         }}>
      {!frontendImage && <LuImageUp className='text-white w-[35px] h-[35px]  ' />}
      {frontendImage && <img src={frontendImage} className='h-full object-cover'/>}
      
    </div>
    <input type="file" accept="image/*" ref={inputImage} hidden onChange={handleImage}/>
      </div>
      {selectedImage &&     <button  className='min-w-[150px] h-[60px] bg-blue-700 font-semibold text-[17px] mt-[30px] text-white py-2 rounded-full cursor-pointer'
      onClick={()=>navigate("/customize2")}>Next</button>
}
      </div>
  )
}

export default Customize