import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js'
import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import creditRouter from './routes/creditRoutes.js'
import { stripeWebhooks } from './controllers/webhooks.js'


const app = express()

app.use((req, res, next) => {
  console.log("BACKEND HIT:", req.method, req.url)
  next()
})

await connectDB()

// Stripe webhook (FIRST)
app.post(
  '/api/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhooks
)

// Global middlewares
app.use(cors())
app.use(express.json())


// routes
app.get('/', (req, res) => {
    res.send("server is live")
})

app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)
app.use('/api/credit', creditRouter)


const PORT = process.env.PORT || 3000

app.listen(PORT, ()=> {
    console.log(`server is runnning on ${PORT}`);
})

