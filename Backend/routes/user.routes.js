import express from 'express'
import  isAuth  from '../middleware/isAuth.js'
import upload from '../middleware/multer.js'
import { askToAssistant, getCurrentUser, updateAssistant } from '../controllers/user.controller.js'
const userrouter = express.Router()

userrouter.get('/current', isAuth,getCurrentUser)
userrouter.post('/update', isAuth,upload.single("assistantImage"),updateAssistant)
userrouter.post('/asktoassistant', isAuth,askToAssistant)

export default userrouter