const express = require("express");
const cors = require('cors')

const http = require('http')
const io = require('socket.io')

const axios = require('axios')

const app = express()
const httpServer = http.createServer(app)

app.use(cors())

const ioServer = io(httpServer, {
    cors: {
        origin: ["http://localhost:4200", "http://localhost:1000"],
    }
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