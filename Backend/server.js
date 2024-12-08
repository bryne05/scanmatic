const express = require("express");
const cors = require("cors");

const app = express();

require("dotenv").config();

//Port
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: [
    `https://localhost:${PORT}`,
    "https://scanmatic.cloud.veluzian.com",
    "https://llama-assuring-monster.ngrok-free.app",
    "https://192.168.68.101:5173",
    "https://192.168.68.101:5173/ZXNzb3IiLCJVfrvonD",
    "https://192.168.68.101:5173/admin",
  ],
  methods: "GET, PUT, POST, DELETE, OPTIONS",
  allowedHeaders: [
    "Content-Type",
    "studtoken",
    "proftoken",
    "admintoken",
    "ngrok-skip-browser-warning",
  ],
};

// Middlewares
app.use(cors(corsOptions));

app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Router
const studentRouter = require("./routes/studentRouter.js");
const professorRouter = require("./routes/professorRouter.js");
const adminRouter = require("./routes/adminRouter.js");

app.use("/api/student", studentRouter);
app.use("/api/professor", professorRouter);
app.use("/api/admin", adminRouter);

app.use("/", (req, res) => {
  res.send("server is yey  dsd e running");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
