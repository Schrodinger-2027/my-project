const express = require('express')
const dotenv = require('dotenv')
const {WebSocketServer} = require('ws')


const app = express()
const PORT = process.env.PORT | 9000


const wss = new WebSocketServer({port : PORT})

wss.on('connection' , (ws)=>{
    ws.on('message' , (data)=>{
        const message = data.toString();
        
        wss.clients.forEach((client)=>{
            if(client != ws){
                client.send('message is : ' + message)
            }
        })
    })
})

app.get('/' , (req , res)=>{
    res.send('Hello')
})



app.listen(PORT , ()=>{
    console.log(`server is connected to : ${PORT}`)
})