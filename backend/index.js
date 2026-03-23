const express = require('express')
const dotenv = require('dotenv')
const http = require('http')
const {WebSocketServer} = require('ws')

dotenv.config()

const app = express()
const PORT = 9000


const server = http.createServer(app)
const wss = new WebSocketServer({ server })

const rooms = new Map()

wss.on('connection' , (ws)=>{
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
                if(client != ws){
                    client.send('message is : ' + message)
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



server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})