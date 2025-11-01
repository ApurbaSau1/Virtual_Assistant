import React, { useContext, useEffect, useRef, useState } from 'react'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa"
import { CgMenuGridO } from "react-icons/cg"
import { motion, AnimatePresence } from "framer-motion"
import aiimg from "../assets/ai.gif"
import userimg from "../assets/user.gif"

const Home = () => {
  const { serverUrl, userData, setUserData, getGeminiResponse } = useContext(userDataContext)
  const navigate = useNavigate()
  const [listening, setListening] = useState(false)
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)

  // State to track if user has started the assistant
  const [isStarted, setIsStarted] = useState(false)
  // State to store available speech synthesis voices
  const [voices, setVoices] = useState([])

  const recognitionRef = useRef(null)
  const isRecognizingRef = useRef(false)
  const isSpeakingRef = useRef(false)
  const synth = window.speechSynthesis

  // Load voices on component mount
  useEffect(() => {
    const loadVoices = () => {
      setVoices(synth.getVoices())
    }
    // Load voices when they are ready
    synth.onvoiceschanged = loadVoices
    // Call it once just in case
    loadVoices()
  }, [synth])

  // 🔴 Logout
  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      setUserData(null)
      toast.error(error.response?.data?.message || "Logout failed")
    }
  }

  // 🎙️ Start recognition
  const startRecognition = () => {
    if (!recognitionRef.current) return
    try {
      recognitionRef.current.start()
      setListening(true)
    } catch (err) {
      if (!err.message.includes("start")) console.log("Recognition start error:", err)
    }
  }

  // 🗣️ Speak
  const speak = (text) => {
    if (!text) return
    const utterance = new SpeechSynthesisUtterance(text)
    
    // Use the 'voices' state to find voices reliably
    const bn = voices.find(v => v.lang === 'bn-IN')
    const hi = voices.find(v => v.lang === 'hi-IN')

    if (bn) utterance.voice = bn
    else if (hi) utterance.voice = hi
    else utterance.lang = 'en-US'

    isSpeakingRef.current = true
    setListening(false)
    recognitionRef.current?.stop()

    utterance.onend = () => {
      isSpeakingRef.current = false
      setAiText("")
      startRecognition() // Restart listening after speaking
    }

    synth.speak(utterance)
  }

  // 🧠 Handle AI commands
  const handleCommand = (data) => {
    const { type, userInput, response } = data
    speak(response)
    const query = userInput ? encodeURIComponent(userInput.trim()) : ""
    const open = (url) => window.open(url, "_blank")

    switch (type) {
      case "google_search": open(`https://www.google.com/search?q=${query}`); break
      case "youtube_search":
      case "youtube_play": {
        const cleanQuery = userInput.replace(/(on\s+)?youtube|play|search/gi, "").trim()
        if (cleanQuery) open(`https://www.youtube.com/results?search_query=${encodeURIComponent(cleanQuery)}`)
        else open("https://www.youtube.com")
        break
      }
      case "wikipedia_search": open(`https://en.wikipedia.org/wiki/Special:Search?search=${query}`); break
      case "news_search": open(`https://news.google.com/search?q=${query}`); break
      case "facebook_search": open(`https://www.facebook.com/search/top/?q=${query}`); break
      case "instagram_search": open(`https://www.instagram.com/${query}`); break
      case "twitter_search": open(`https://twitter.com/search?q=${query}`); break
      case "linkedin_search": open(`https://www.linkedin.com/search/results/all/?keywords=${query}`); break
      case "github_search": open(`https://github.com/search?q=${query}`); break
      case "calculator_open": open("https://www.google.com/search?q=calculator"); break
      case "google_open": open("https://www.google.com"); break
      case "youtube_open": open("https://www.youtube.com"); break
      case "wikipedia_open": open("https://www.wikipedia.org"); break
      case "facebook_open": open("https://www.facebook.com"); break
      case "instagram_open": open("https://www.instagram.com"); break
      case "twitter_open": open("https://www.twitter.com"); break
      case "linkedin_open": open("https://www.linkedin.com"); break
      case "github_open": open("https://www.github.com"); break
      case "email": open("https://mail.google.com"); break
      case "weather": open(`https://www.google.com/search?q=weather+${query}`); break
      case "time": open("https://www.google.com/search?q=current+time"); break
      case "date": open("https://www.google.com/search?q=current+date"); break
      case "math": open(`https://www.google.com/search?q=${query}`); break
      case "amazon_search": open(`https://www.amazon.in/s?k=${query}`); break
      case "flipkart_search": open(`https://www.flipkart.com/search?q=${query}`); break
      case "amazon": open("https://www.amazon.in"); break
      case "flipkart": open("https://www.flipkart.com"); break
      default: break
    }
  }

  // Function to be called by the user's first click
  const handleStartAssistant = () => {
    setIsStarted(true) // Show the main UI

    // Now that the user has clicked, we can safely speak
    if (userData) {
      const greeting = new SpeechSynthesisUtterance(`Hello Sir ${userData.name}. What can I do for you?`)
      
      // Use 'voices' state
      const bn = voices.find(v => v.lang === 'bn-IN')
      if (bn) {
        greeting.voice = bn
      } else {
        greeting.lang = 'en-US' // Fallback
      }

      greeting.onend = () => {
        startRecognition() // Start listening *after* greeting
      }
      window.speechSynthesis.speak(greeting)
    } else {
      // If no user data, just start listening
      startRecognition()
    }
  }

  // 🎧 Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      toast.error("Speech Recognition not supported in this browser")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.lang = 'en-US'
    recognitionRef.current = recognition

    const safeStart = () => {
      // Only try to start if the assistant has been started
      if (isStarted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try { recognition.start() } catch { }
      }
    }

    recognition.onstart = () => { isRecognizingRef.current = true; setListening(true) }

    recognition.onend = () => {
      isRecognizingRef.current = false
      if (isStarted && !isSpeakingRef.current) {
        setListening(false)
        setTimeout(safeStart, 1000) // Auto-restart loop
      }
    }

    recognition.onerror = (e) => {
      isRecognizingRef.current = false
      if (isStarted && !isSpeakingRef.current) setListening(false)
      if (isStarted && e.error !== 'aborted' && !isSpeakingRef.current) setTimeout(safeStart, 1000)
    }

    recognition.onresult = async (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim()
      if (userData && transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        recognition.stop() // Stop while processing
        setUserText(transcript)
        setAiText("")
        const data = await getGeminiResponse(transcript)
        setAiText(data.response)
        handleCommand(data)
        setUserText("")
      }
    }
 
    return () => { recognition.stop() }
  }, [userData, isStarted, getGeminiResponse]) // Added 'isStarted' dependency

  // 🎞️ Menu Animations
  const menuVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 }
  }

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#030353] flex justify-center items-center flex-col p-[20px] relative overflow-hidden">

      {/* "Tap Anywhere" Overlay */}
      {!isStarted && (
        <div
          className="absolute inset-0 z-50 flex flex-col justify-center items-center bg-[#030353] cursor-pointer"
          onClick={handleStartAssistant}
        >
          <h1 className="text-4xl text-white font-bold mb-4">
            Welcome {userData?.name}
          </h1>
          <p className="text-lg text-gray-300 mb-8 animate-pulse">
            Tap anywhere to start the assistant
          </p>
          <FaMicrophone className="text-white text-6xl" />
        </div>
      )}

      {/* Only render the UI if 'isStarted' is true */}
      {isStarted && (
        <>
          {/* Hamburger */}
          <div className="absolute top-5 right-5 z-50">
            {!menuOpen && (
              <CgMenuGridO
                className="text-white w-[30px] h-[30px] cursor-pointer lg:hidden"
                onClick={() => setMenuOpen(true)}
              />
            )}

            {/* Desktop Buttons */}
            <div className="hidden lg:flex flex-col gap-3">
              <button onClick={handleLogout}
                className="min-w-[150px] h-[60px] mt-[10px] text-white font-semibold bg-[#e92525de] rounded-full text-[19px]">
                Logout
              </button>
              <button onClick={() => navigate('/customize')}
                className="min-w-[150px] h-[60px] text-white font-semibold bg-[#25bfe9de] rounded-full text-[19px]">
                Customize
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                key="menu"
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="fixed top-0 right-0 w-[70%] h-full bg-[#00000069] rounded-2xl backdrop-blur-lg flex flex-col items-center justify-center gap-8 z-40 lg:hidden"
              >
                <button onClick={() => setMenuOpen(false)}
                  className="absolute top-5 right-5 text-white text-3xl font-bold hover:text-red-400 transition-all">
                  ×
                </button>

                <button onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="w-[150px] h-[55px] absolute top-[2%] text-white font-semibold bg-[#e92525de] rounded-full">
                  Logout
                </button>

                <button onClick={() => { setMenuOpen(false); navigate('/customize'); }}
                  className="w-[150px] h-[55px] absolute top-[12%] text-white font-semibold bg-[#25bfe9de] rounded-full">
                  Customize
                </button>

                <div className="w-[90%] h-[2px] absolute top-[22%] bg-gray-400" />
                <h1 className="text-white absolute top-[25%] text-lg">History</h1>

                <div className="w-[80%] h-[60%] absolute top-[30%] overflow-auto flex flex-col gap-2">
                  {userData?.HISTORY?.map((history, i) => (
                    <span key={i} className="text-white">{i + 1}. {history}</span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Avatar */}
          <motion.div
            className="w-[220px] h-[320px] rounded overflow-hidden border-4 border-cyan-400 shadow-xl shadow-cyan-500/50"
            animate={{
              boxShadow: listening
                ? "0 0 40px rgba(0,255,255,0.5),0 0 80px rgba(0,255,255,0.2)"
                : "0 0 20px rgba(59,130,246,0.3)"
            }}
            transition={{ duration: 1 }}
          >
            <img src={userData?.assistantImage} alt={userData?.assistantName} className="w-full h-full object-cover" />
          </motion.div>

          <h1 className="text-3xl mt-5 text-white font-bold">I’m {userData?.assistantName}</h1>

          {/* Mic status */}
          <motion.div className="mt-6 flex items-center gap-3 text-xl text-white"
            animate={{ opacity: listening ? [0.7, 1, 0.7] : 1 }}
            transition={{ repeat: listening ? Infinity : 0, duration: 1 }}
          >
            {listening
              ? <FaMicrophone className="text-green-400 animate-pulse" />
              : <FaMicrophoneSlash className="text-gray-400" />}
            <p>{listening ? "Listening..." : "Inactive"}</p>
          </motion.div>

          {/* Voice animation */}
          {!aiText && <img src={userimg} alt="" className="w-[300px] h-[100px]" />}
          {aiText && <img src={aiimg} alt="" className="w-[300px] h-[100px]" />}

          {/* AI/User Text */}
          <h1 className="text-white mt-4 text-center max-w-[80%]">
            {userText || aiText || ""}
          </h1>
        </>
      )}
    </div>
  )
}

export default Home
