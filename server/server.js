import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js'
import cookieParser from 'cookie-parser'
import userRouter from './routes/userRoutes.js'
import chatRouter from './routes/chatRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import creditRouter from './routes/creditRoutes.js'
import imageRouter from './routes/imageRoutes.js'
import { stripeWebhooks } from './controllers/webhooks.js'


const app = express()

await connectDB()

// Stripe webhook (FIRST)
app.post(
  '/api/stripe',
  express.raw({ type: 'application/json' }),
  stripeWebhooks
)

// Global middlewares
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.use((req, res, next) => {
  console.log(`>>> Incoming Request: ${req.method} ${req.url}`);
  next();
});

// routes
app.get('/', (req, res) => {
    res.send("server is live")
})

app.use('/api/user', userRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)
app.use('/api/credit', creditRouter)
app.use('/api/image', imageRouter)


// Final 404 Handler for undefined routes
app.use((req, res) => {
    console.log(`!!! ROUTE NOT FOUND: ${req.method} ${req.url}`);
    res.status(404).json({ success: false, message: "Endpoint not found on server" });
});

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=> {
    console.log(`server is runnning on ${PORT}`);
})

