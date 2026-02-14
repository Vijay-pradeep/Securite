const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend folder
app.use(express.static(path.join(__dirname, "frontend")));

const PORT = process.env.PORT || 8080;

// Default user
let users = [
  {
    username: "admin",
    password: bcrypt.hashSync("1234", 10)
  }
];

// REGISTER
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ message: "Username & password required" });
  }

  const exists = users.find(u => u.username === username);
  if (exists) {
    return res.json({ message: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  users.push({ username, password: hashed });

  res.json({ message: "User registered successfully" });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) return res.json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ message: "Wrong password" });

  res.json({ message: "Login successful" });
});

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
