require('dotenv').config()

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const mongoose = require("mongoose");
const Account = require('./models/Account');

const http = require('http');
const io = require('socket.io')


const dbUrl = "mongodb://127.0.0.1:27017/TalkBack"

const app = express();
const httpServer = http.createServer(app);

const ioServer = io(httpServer, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:2000"]
    },
})



app.use(express.json());
app.use(cors());

const accountRoute = require("./routes/accountRoute")
app.use("/users", accountRoute)

// const activeUsers = {};


ioServer.on("connection", (socket) => {
    console.log(`${socket.id} is connected`);
    

    socket.on("userConnected", (username) => {
        console.log(`${username} is now online`);
        ioServer.emit("userConnected", username, socket.id);
    })

    socket.on("disconnect", () => {
            console.log(`disconnected`)
            ioServer.emit("userDisconnected", socket.id);
        }
    );
    
    // socket.on("userConnectedToAuthService", (username) => {
    //     console.log(`Received userConnectedToAuthService event: ${username}`);
    //     console.log(`${username} is connected`);
    // });


//   socket.on("disconnect", () => {
//     const username = activeUsers[socket.id];
//     if (username) {
//         console.log(`${username} disconnected`);
//         delete activeUsers[socket.id];
//         ioServer.emit("updateActiveUsers", Object.values(activeUsers));
//     }
// });

    // socket.on("sendMessage", (message) => {
    //     console.log(message)
    // })
})

const authenticateToken = async (req, res, next) => {
    if(req.headers.authorization){
        const token = req.headers.authorization
        if(token){
         const payload = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
         console.log(payload)
         next()
        }
        else{
            return res.status(401).send('Authentication Error')
        }
    }
    else{
        return res.status(401).send('Authentication Error')
    }
    
    }

// app.get("/users", authenticateToken, async (req, res) => {
//   const users = await Account.find()
//   res.send(users)
  
// });



// app.post("/users", async (req, res) => {
//     bcrypt.hash(req.body.password, 10).then(async (hashedPassword) => {
//     const account = new Account({ username: req.body.username, password: hashedPassword });
//     try{
//         await account.save();
//         res.send(account)
//     }
//      catch(err) {
//     res.status(500);
//     res.send(err);
//   }
// });
// })



// app.post("/users/login", async (req, res) => {
//   const account = await Account.findOne({username: req.body.username});
//   if (account) {
//     bcrypt.compare(req.body.password, account.password).then((result) => {
//         if(result) {
//            const token = jwt.sign(account.username, process.env.ACCESS_TOKEN_SECRET)
//             res.send({ accessToken: token, username: account.username });
//         }else {
//             res.status(400);
//             res.send("Inccorect Username or Password !");
//             res.end();
//           }
//     })
//   }else{
//     res.status(404);
//     res.send("User Does not Exist !");
//     res.end();
//   }
// });


mongoose.connect(dbUrl)
.then(() => {
    console.log("Connecting to Database")
httpServer.listen(1000);
    
})

