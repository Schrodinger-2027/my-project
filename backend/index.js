const express = require('express')
const dotenv = require('dotenv')
const http = require('http')
const {WebSocketServer} = require('ws')
const { connectDB } = require('./util')
const { UserSignUp } = require('./controllers/UserSignUp.js')
const { userLogin } = require('./controllers/UserLogin.js')
const { verifyToken } = require('./middlewares/auth.js')

dotenv.config()

const PORT = 9000
const MONGODB_URL = process.env.MONGODB_URL

const app = express()
connectDB(MONGODB_URL)


app.use(express.json())
app.use(express.urlencoded({extended : true}))





const server = http.createServer(app)
const wss = new WebSocketServer({ server })

const rooms = new Map()

wss.on('connection' , (ws , req)=>{

   
    const url = new URL(req.url , `http://localhost:${PORT}`)
    const token = url.searchParams.get('token')

    const decoded = verifyToken(token)

    if(!decoded){
        ws.send('Unauthorized - Invalid or expired token')
        ws.close() 
        return
    }
    ws.userId = decoded.userId
   
    ws.on('message' , (data)=>{
        
        let parsedData
        try {
            parsedData = JSON.parse(data.toString())
        } catch (e) {
            ws.send(JSON.stringify({ error: 'Invalid JSON' }))
            return
        }

        const {type , roomId , message} = parsedData;

        if(type === 'join'){
            if (!roomId) {
                ws.send(JSON.stringify({ error: 'roomId required' }))
                return
            }

            if(!rooms.has(roomId)){
                rooms.set(roomId , new Set())
            }
            rooms.get(roomId).add(ws)
            ws.roomId = roomId
            console.log(`User Joined ${roomId}`)
        }
        else if(type === 'message'){

            if (!ws.roomId || !rooms.has(ws.roomId)) {
                ws.send(JSON.stringify({ error: 'Join a room first' }))
                return
            }
            
            const room = rooms.get(ws.roomId)

            room.forEach(client => {
                if(client !== ws){
                    client.send(JSON.stringify({message}))
                }
            });
        }
    })

    ws.on('close', () => {
        const roomId = ws.roomId
        if (roomId && rooms.has(roomId)) {
            rooms.get(roomId).delete(ws)
        }
        console.log("User disconnected")
    })
})

app.get('/' , (req , res)=>{
    res.send('Hello')
})

app.post('/signup' , UserSignUp)
app.post('/login' , userLogin)



server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})