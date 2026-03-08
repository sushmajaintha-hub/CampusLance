
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const { protect, authorize } = require("./middleware/authMiddleware");
const projectRoutes = require("./routes/projectRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const messageRoutes = require("./routes/messageRoutes");
const profileRoutes = require("./routes/profileRoutes");
const chatRoutes = require("./routes/chatRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRoutes);
// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payment",paymentRoutes)
app.use("/api/admin", adminRoutes);


app.get("/", (req, res) => {
  res.send("CampusLance API Running 🚀");
});

app.get("/api/profile", protect, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

app.get("/api/client-only", protect, authorize("client"), (req, res) => {
  res.json({ message: "Welcome Client 🎉" });
});

const PORT = 5000;
app.use("/api/applications", applicationRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});