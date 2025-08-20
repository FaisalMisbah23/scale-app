const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const hostname = "0.0.0.0";
const port = 3000;
const version = "1.0.0";

const mongoUrl =
  process.env.MONGO_URL ||
  "mongodb+srv://faisalmisbah23:fRZzSIYZx1K84mz8@cluster0.qqcrver.mongodb.net/devops-prc";

if (!mongoUrl) {
  console.error("Error: MONGO_URL environment variable is not set.");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB successfully!"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Define a simple user schema
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

const User = mongoose.model("User", userSchema);

// Home route
app.get("/", (req, res) => {
  const indexPath = path.join(__dirname, "html", "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(500).send("index.html not found");
      console.error("Error sending index.html:", err);
    }
  });
  console.log(
    `[Version ${version}]: New request => http://${hostname}:${port}` + req.url
  );
});

// Health check route
app.get("/health", (req, res) => {
  res.sendStatus(200);
  console.log(`[Version ${version}]: Health check passed`);
});

// Add a user to MongoDB
app.get("/add-user", async (req, res) => {
  try {
    const newUser = new User({ name: "John Doe", age: 25 });
    await newUser.save();
    res.send("User added successfully!");
    console.log("User added:", newUser);
  } catch (error) {
    res.status(500).send("Error adding user");
    console.error("Error:", error);
  }
});

// Get all users from MongoDB
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
    console.log("Fetched users:", users);
  } catch (error) {
    res.status(500).send("Error fetching users");
    console.error("Error:", error);
  }
});

app.listen(port, () => {
  console.log(
    `[Version ${version}]: Server is running at http://${hostname}:${port}/`
  );
});
