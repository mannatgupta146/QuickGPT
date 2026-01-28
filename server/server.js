import express from 'express'
import 'dotenv/config'
import cors from 'cors'

const app = express()

// middlewares
app.use(cors())
app.use(express.json())

// routes
app.get('/', (req, res) => {
    res.send("server is live")
})

const PORT = process.env.PORT || 3000

app.listen(PORT, ()=> {
    console.log(`server is runnning on ${PORT}`);
    
})