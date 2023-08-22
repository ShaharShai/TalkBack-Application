const express = require("express");
const cors = require('cors')

const http = require('http')
const io = require('socket.io')

const axios = require('axios')

const app = express()
const httpServer = http.createServer(app)

// const io2  =  require("socket.io-client")

// const authSocket = io2("http://localhost:1000");

const authSocket = require("socket.io-client")("http://localhost:1000")

app.use(cors())

const activeUsers = {};

const ioServer = io(httpServer, {
    cors: {
        origin: ["http://localhost:5173", "http://localhost:1000"],
    }
})

ioServer.on("connection", (socket) => {
    console.log(`${socket.id} is connected !`);

    authSocket.on("userConnected", (username, id) => {  
        console.log(`${username} is now online`);
    
        if (!activeUsers[id] && !Object.values(activeUsers).includes(username)) {
            activeUsers[id] = username;
            ioServer.emit("updateActiveUsers", Object.values(activeUsers)); 
        }
     })

     authSocket.on("userDisconnected", (id) => {
        const username = activeUsers[id]
        if(username) {
            console.log(`${username} disconnected`);
            delete activeUsers[id];
            ioServer.emit("updateActiveUsers", Object.values(activeUsers));
        }
     })

     socket.on("userDisconnectedButton", (username) => {
        const idToRemove = Object.keys(activeUsers).find(id => activeUsers[id] === username);
        console.log(idToRemove)
        if (idToRemove) {
            console.log(`${username} disconnected`);
            delete activeUsers[idToRemove];
            ioServer.emit("updateActiveUsers", Object.values(activeUsers));
        } else {
            console.log(`User ${username} not found in activeUsers`);
        }
    });


     
    //  authSocket.on("userConnected", (username, id) => {  
    //     console.log(`${username} is now online`);
    
    //     if (!activeUsers[id] && !Object.values(activeUsers).includes(username)) {
    //         activeUsers[id] = {username: username, status: "online"};
    //         ioServer.emit("updateActiveUsers", Object.values(activeUsers)); 
    //     }

    //     if (Object.values(activeUsers).includes(username)) {
    //         const index = activeUsers.indexOf(username);
    //         activeUsers[index] = {username: username, status: "online"};
    //         ioServer.emit("updateActiveUsers", Object.values(activeUsers)); 
    //     }
    //  })

    //  authSocket.on("userDisconnected", (id) => {
    //     const username = activeUsers[id]
    //     if(username) {
    //         console.log(`${username} disconnected`);
    //         // delete activeUsers[id];
    //         activeUsers[id] = {...activeUsers[id], status: "offline"};
    //         ioServer.emit("updateActiveUsers", Object.values(activeUsers));
    //     }
    //  })

  
})

app.get('/users', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:1000/users');
        res.send(response.data);
    } catch (error) {
        res.status(500).send('Error fetching user data.');
    }
});



httpServer.listen(2000)