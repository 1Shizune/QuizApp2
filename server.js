require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const path = require("path");

app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect(process.env.MONGO_URI)  
.then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB connection error:", err));

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  scores: [
    {
      score: Number,
      date: { type: Date, default: Date.now },
      details: [
        {
          question: String,
          user_answer: String,
          correct_answer: String,
          isCorrect: Boolean
        }
      ]
    }
  ]
});

const User = mongoose.model("User", UserSchema);

app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;
  const exists = await User.findOne({ username });
  if (exists) return res.json({ success: false, message: "User already exists" });

  const hash = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hash });
  await user.save();

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ success: true, token });
});


app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ success: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ success: false });
  }
};


app.post("/api/score", auth, async (req, res) => {
  const { score, details } = req.body;

  await User.findByIdAndUpdate(req.userId, {
    $push: { scores: { score, details } }
  });

  res.json({ success: true });
});



app.get("/api/profile", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json({ username: user.username, scores: user.scores });
});


app.get("/api/leaderboard", async (req, res) => {
  const users = await User.aggregate([
    { $unwind: "$scores" },
    { $group: { _id: "$username", totalScore: { $sum: "$scores.score" } } },
    { $sort: { totalScore: -1 } },
    { $limit: 10 }
  ]);
  res.json(users);
});

app.post('/api/reset-history', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.userId, { scores: [] });
    res.json({ success: true });
  } catch (err) {
    console.error("Reset history error:", err);
    res.status(500).json({ success: false });
  }
});


app.listen(3000, () => console.log("Server running on http://localhost:3000"));
