const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://andassatybaldy:AOCLLnUWAuZ9oeU3@cluster0.whktpxa.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = mongoose.model("User", {
  username: String,
  passwordHash: String,
});

const secret = "mySuperSecretKey123";

// Registration
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username, passwordHash });
  await user.save();
  res.status(201).json({ message: "User registered successfully" });
});

// Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (await bcrypt.compare(password, user.passwordHash)) {
    const token = jwt.sign({ username }, secret);
    return res.json({ token });
  } else {
    return res.status(401).json({ message: "Authentication failed" });
  }
});

// Protected Route
app.get("/protected", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const payload = jwt.verify(token, secret);
    res.json({ message: `Hello, ${payload.username}! This is a protected route.` });
  } catch (error) {
    res.status(401).json({ message: "Authentication failed" });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
