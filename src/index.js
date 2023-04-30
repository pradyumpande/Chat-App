const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const {generateMessage,generateLocationMessage}=require('./utils/messages')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const  {addUser,removeUser,getUser,getUsersInRoom} =require('./utils/users')
const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))


io.on('connection',(socket)=>{
    console.log('New webSocket connection')



    socket.on('join',({id,username,room})=>{
        const user=addUser(id,username,room)
        
        socket.join(user.room)
        socket.emit('messages',generateMessage('Admin','Welcome to the Chat-App'))
        socket.broadcast.to(user.room).emit('messages',generateMessage('Admin',`${user.username} has joined!`))
        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        
        
    })


    socket.on('sendMessage',(message,callback)=>{
        const user = getUser(socket.id)
        
        io.emit('messages',generateMessage(user.username,message))
        callback('delivered')
    })

    socket.on('sendLocation',(coords, callback)=>{

        const user =getUser(socket.id)
        io.emit('LocationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback('delivered')
    })
  

    


socket.on('disconnect',()=>{
    const user = removeUser(socket.id)

    if(user){

        io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
    }

})
})
server.listen(port,()=>{
    console.log('server is up on port',port)
})
  