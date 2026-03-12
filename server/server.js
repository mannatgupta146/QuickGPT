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
const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:5173'];
app.use(cors({ 
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }, 
    credentials: true 
}))
app.use(express.json())
app.use(cookieParser())

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

