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
    "https://192.168.31.238:5173",
    "https://192.168.31.238:5173/ZXNzb3IiLCJVfrvonD",
  ],
  methods: "GET, PUT, POST, DELETE, OPTIONS",
  allowedHeaders: [
    "Content-Type",
    "studtoken",
    "proftoken",
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
app.use("/api/student", studentRouter);
app.use("/api/professor", professorRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
