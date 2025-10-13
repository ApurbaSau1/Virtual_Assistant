import React from 'react'
import { userDataContext } from '../context/usercontext'

const Card = ({image}) => {
   const{serverUrl,
      userData,
      setUserData,  
      frontendImage,
      setFrontendImage,
      backendImage,
      setBackendImage,
      selectedImage,
      setSelectedImage}=React.useContext(userDataContext)
  return (
     <div className={`w-[80px] h-[160px] lg:w-[150px] lg:h-[250px] bg-[#030326]
      border-2 border-[blue] rounded-2xl  overflow-hidden hover:shadow-blue-950 
      cursor-pointer hover:border-4 hover:border-white ${selectedImage === image ? 'border-4 border-white' : ''}`}onClick={()=>{
        setSelectedImage(image)
        setBackendImage(null)
        setFrontendImage(null)
      }}>
      <img src={image} className='h-full object-cover'/>
    </div>
  )
}

export default Card