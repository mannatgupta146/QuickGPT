import express from 'express'
import { createChat, deleteChat, getChat, renameChat } from '../controllers/chatController.js'
import { protect } from '../middlewares/Auth.js'

const chatRouter = express.Router()

chatRouter.get('/create', protect, createChat)
chatRouter.get('/get',protect, getChat)
chatRouter.post('/delete',protect, deleteChat)
chatRouter.post('/rename',protect, renameChat)

export default chatRouter