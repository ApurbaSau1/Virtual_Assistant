import User from "../models/user.model.js";
import  uploadOnCloudinary  from "../config/cloudinary.js";
import geminiResponse from "../gemini.js"
import moment from "moment"
import { response } from "express";
export const getcurrentUser= async(req,res)=>{
    try {
        const userId=req.userId
        const user=await User.findById(userId).select("-password")
        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({message:"get current user internal server error"})
    }
}
export const getCurrentUser = getcurrentUser;

export const updateAssistant=async(req,res)=>{
    try {
        const{assistantName,imageUrl}=req.body
        let assistantImage;
        if(req.file){
            assistantImage=await uploadOnCloudinary(req.file.path)
            // console.log(assistantImage);
            
                }
        else{
            assistantImage=imageUrl
        }
        const user=await User.findByIdAndUpdate(req.userId,{
            assistantName,
            assistantImage},{new:true}).select("-password")
            return res.status(200).json(user)
    } catch (error) {
        res.status(500).json({message:"update assistant internal server error"})
    }
}

export const askToAssistant=async(req,res)=>{
    try {
        const {command}=req.body
        const user=await User.findById(req.userId);
        user.HISTORY.push(command)
        user.save()
        const username=user.name
        const assistantImage=user.assistantImage
        const assistantName=user.assistantName
        const result=await geminiResponse(command,username,assistantName)

        const jsonMatch=result.match(/{[\s\S]*}/)
        if(!jsonMatch){
            return res.status(400).json({message:"Invalid response from assistant"})
        }
        const gemResult=JSON.parse(jsonMatch[0])
        // console.log(gemResult);
        
        const type=gemResult.type
        switch (type) {
            case  'date':
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response:`current date is ${moment().format("YYYY-MM-DD")}`,
                })
                break;
            case  'get_date':
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response:`current date is ${moment().format("YYYY-MM-DD")}`,
                })
                break;
            case 'get_time':
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response:`current time is ${moment().format("HH:mm A")}`,
                })
                break;
            case 'time':
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response:`current time is ${moment().format("HH:mm A")}`,
                })
                break;
            case 'get_day':
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response:`current day is ${moment().format("dddd")}`,
                })
                break;
            case 'day':
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response:`current day is ${moment().format("dddd")}`,
                })
                break;
            case 'get_month':
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response:`current month is ${moment().format("MMMM")}`,
                })
                break;
            case 'month':
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response:`current month is ${moment().format("MMMM")}`,
                })
            case 'get_year':
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response:`current year is ${moment().format("YYYY")}`,
                })  
                break;
            // case 'other'     || 'general' || 'fun-fact' || 'joke' || 'quote' || 'riddle' || 'personality' || 'story' || 'poem' || 'game':
            //     return res.json({
            //         type,
            //         userInput:gemResult.userInput,
            //         response:gemResult.response,
            //     })  
            case 'joke':
            case 'quote':
            case 'fun_fact':
            case 'riddle':
            case 'personality':
            case 'story':
            case 'poem':
            case 'game':
            case 'math':
            case 'calendar':
            case 'amazon_search':
            case 'flipkart_search':
            case 'amazon':
            case 'flipkart':
            case 'translation':
            case 'restaurant_search':
            case 'hotel_search':
            case 'google_search': 
            case 'youtube_search':
            case 'wikipedia_search':
            case 'news_search':
            case 'facebook_search':
            case 'instagram_search':
            case 'twitter_search':
            case 'linkedin_search':
            case 'github_search':
            case 'calculator_open':
            case "weather":
            case 'youtube_play':
                return res.json({
                    type,    
                    userInput:gemResult.userInput,
                    response:gemResult.response,
                })
            case 'google_open' :
            case 'youtube_open' :
            case 'wikipedia_open' :
            case 'facebook_open' :
            case 'instagram_open' :
            case 'twitter_open' :
            case 'linkedin_open' :
            case 'github_open':
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response:gemResult.response,
                })
            case 'email':
                return res.json({
                    type,
                    userInput:gemResult.userInput,
                    response:gemResult.response,
                })  
            default:
                return res.json({
                    type:'other',
                    userInput:gemResult.userInput,
                    response:gemResult.response || "i am sorry i can't answer this question",
                })  
        }
    } catch (error) {
        res.status(500).json({message:"ask to assistant  error"})
    }
}