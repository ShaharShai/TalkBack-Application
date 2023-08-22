require('dotenv').config()

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Account = require("../models/Account")

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await Account.find()
  res.send(users)
});

router.post("/", async (req, res) => {
    bcrypt.hash(req.body.password, 10).then(async (hashedPassword) => {
    const account = new Account({ username: req.body.username, password: hashedPassword });
    try{
        await account.save();
        res.send(account)
    }
     catch(err) {
    res.status(500);
    res.send(err);
  }
});
})


router.post("/login", async (req, res) => {
  const account = await Account.findOne({username: req.body.username});
  if (account) {
    bcrypt.compare(req.body.password, account.password).then((result) => {
        if(result) {
           const token = jwt.sign(account.username, process.env.ACCESS_TOKEN_SECRET)
            res.send({ accessToken: token, username: account.username });
        }else {
            res.status(400);
            res.send("Inccorect Username or Password !");
            res.end();
          }
    })
  }else{
    res.status(404);
    res.send("User Does not Exist !");
    res.end();
  }
});


module.exports = router;