require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const { requireAuth, requireAdminAuth } = require("./middleware/auth");
const degreeProgramRoutes = require("./routes/degreeProgram");
const courseRoutes = require("./routes/course");
const facultyRoutes = require("./routes/faculty");
const roomRoutes = require("./routes/room");
const blocRoutes = require("./routes/bloc");
const semesterRoutes = require("./routes/semester");
const scheduleRoutes = require("./routes/schedule");
const authRoutes = require("./routes/auth");
const summaryRoutes = require("./routes/summary");
const loginRoutes = require("./routes/auth");
const signupRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
// express app
const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/auth", loginRoutes);
app.use("/api/signup", loginRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/semester", semesterRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/room", roomRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/signup", authRoutes);
app.use("/api/bloc", blocRoutes);
app.use("/api/degreeprogram", degreeProgramRoutes);
app.use("/api/summary", summaryRoutes);
app.use("/api/admin/", requireAdminAuth, adminRoutes);

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to database");
    // listen to port
    app.listen(process.env.PORT, () => {
      console.log("listening for requests on port", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });
