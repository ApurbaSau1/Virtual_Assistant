import React, { useContext } from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import Signin from './pages/signin'
import Signup from './pages/signup'
import Customize from './pages/Customize'
import { userDataContext } from './context/UserContext'
import Home from './pages/Home.jsx'
import Customize2 from './pages/Customize2'
const App = () => {
  const{userData,setUserData}=useContext(userDataContext)

    
  return (
    <Routes>
      <Route path='/' element={(userData?.assistantImage && userData?.assistantName)? <Home/> :<Navigate to={"/customize"}/>}/>
      <Route path='/signin' element={!userData?<Signin/>:<Navigate to={"/"}/>}/>
      <Route path='/signup' element={!userData?<Signup/>:<Navigate to={"/"}/>}/>
      <Route path='/customize' element={userData?<Customize/>:<Navigate to={"/signup"}/>}/>
      <Route path='/customize2' element={userData?<Customize2/>:<Navigate to={"/signup"}/>}/>
      <Route path='*' element={<div className='w-full h-[100vh]  flex justify-center items-center'><img src="https://media.licdn.com/dms/image/v2/C5112AQEw1fXuabCTyQ/article-inline_image-shrink_1500_2232/article-inline_image-shrink_1500_2232/0/1581099611064?e=1762387200&v=beta&t=REpmuD079v2zeL6abmBTpKs3_aCCap9CjBPW6sJCYcE" alt="" /></div>}/>
    </Routes>
  )
}

export default App