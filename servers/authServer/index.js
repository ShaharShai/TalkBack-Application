require('dotenv').config()

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const users = [
  {
    username: "Kyle",
    password: "1234",
  },
];

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

app.get("/users", authenticateToken, (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { username: req.body.username, password: hashedPassword };
    users.push(user);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

app.post("/users/login", async (req, res) => {
  const user = await users.find((user) => user.username === req.body.username);
  if (user == null) {
    return res.status(400).send("Can not find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign(user.username, process.env.ACCESS_TOKEN_SECRET)
      res.json({ accessToken: accessToken })
    } else {
        res.status(401);
        res.send("Authentication failed: Incorrect password")
    }
  } catch (err) {
    res.status(500);
    res.send("User Does not Exist !");
  }
});



app.listen(1000);
