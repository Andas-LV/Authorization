const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require('dotenv').config();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

const uri = process.env.MONGO_URI;
const secret = process.env.SECRET;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

const User = mongoose.model("User", {
  username: String,
  passwordHash: String,
});

// Регистрация
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ username, passwordHash });
  await user.save();
  res.status(201).json({ message: "User registered successfully" });
});

// Логин с установкой cookie
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (await bcrypt.compare(password, user.passwordHash)) {
    const token = jwt.sign({ username }, secret, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: true });
    return res.json({ message: "Authentication successful", token });
  } else {
    return res.status(401).json({ message: "Authentication failed" });
  }
});

// Защищенный маршрут с проверкой cookie
app.get("/protected", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Authentication failed" });
  }
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
