const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use(express.json());

const users = [
  {
    username: "Kyle",
    password: 1234,
  },
];

app.get("/users", (req, res) => {
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
      res.send(`${user.username} Conncted`);
    } else {
      res.send("Not Authenticated");
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(1000);
