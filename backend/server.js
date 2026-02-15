const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

const PORT = process.env.PORT || 8080;
const USERS_FILE = path.join(__dirname, "users.json");

// Read users
function readUsers() {
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

// Save users
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Default admin from ENV
const ADMIN_PASS = process.env.ADMIN_PASS || "1234";

// Initialize admin if file empty
if (readUsers().length === 0) {
  const hashed = bcrypt.hashSync(ADMIN_PASS, 10);
  saveUsers([{ username: "admin", password: hashed }]);
}

// REGISTER
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  let users = readUsers();

  if (users.find(u => u.username === username)) {
    return res.json({ message: "User exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  users.push({ username, password: hashed });
  saveUsers(users);

  res.json({ message: "Registered" });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.username === username);

  if (!user) return res.json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ message: "Wrong password" });

  res.json({ message: "Login successful" });
});

// HEALTH
app.get("/health", (_, res) => res.send("OK"));

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
