const express = require('express')
const cors = require('cors')

const http = require('http')
const io = require('socket.io')

const app = express()
const httpServer = http.createServer(app)

app.use(cors())

const ioServer = io(httpServer, {
    cors: {
        origin: ["http://localhost:5173"]
    }
})

ioServer.on("connection", (socket) => {
    console.log(`${socket.id} is connected !`);

    socket.on('join', (room) => {
        socket.join(room);
        console.log(`${socket.id} joined ${room}`)
      });

      socket.on('chat message', (room, message) => {
        socket.to(room).emit('chat message', {id: message.id, message: message.message, user: message.user});
      });

      
    //   socket.on('message sent', (id) => {
    //     socket.emit("message received", id);
    //   })

      socket.on('message received', (id) => {
        console.log(`Message with ID ${id} has been received by the recipient.`);
      });
})

httpServer.listen(3000)