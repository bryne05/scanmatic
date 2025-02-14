// const express = require("express");
// const cors = require("cors");

// const app = express();

// require("dotenv").config();

// //Port
// const PORT = process.env.PORT || 5000;

// const corsOptions = {
//   origin: [
//     `https://localhost:${PORT}`,
//     "https://scanmatic.cloud.veluzian.com",
//     "https://llama-assuring-monster.ngrok-free.app",
//     "https://192.168.68.101:5175",
//     "https://192.168.68.101:5173",
//     "https://192.168.68.101:5175/ZXNzb3IiLCJVfrvonD",
//     "https://192.168.68.101:5175/admin",
//   ],
//   methods: "GET, PUT, POST, DELETE, OPTIONS",
//   allowedHeaders: [
//     "Content-Type",
//     "studtoken",
//     "proftoken",
//     "admintoken",
//     "ngrok-skip-browser-warning",
//   ],
// };

// // Middlewares
// app.use(cors(corsOptions));

// app.use((req, res, next) => {
//   if (req.method === "OPTIONS") {
//     res.status(200).end();
//   } else {
//     next();
//   }
// });

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// //Router
// const studentRouter = require("./routes/studentRouter.js");
// const professorRouter = require("./routes/professorRouter.js");
// const adminRouter = require("./routes/adminRouter.js");

// app.use("/api/student", studentRouter);
// app.use("/api/professor", professorRouter);
// app.use("/api/admin", adminRouter);

// app.use("/", (req, res) => {
//   res.send("server is yey mais running");
// });
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// module.exports = app;

const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const axios = require("axios");
const db = require("./models");
const app = express();

require("dotenv").config();

// Port
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: [
    `https://localhost:${PORT}`,
    "https://scanmatic.cloud.veluzian.com",
    "https://llama-assuring-monster.ngrok-free.app",
    "https://www.scanmatic.site",
    "https://www.scanmatic.site/admin",
    "https://www.scanmatic.site/ZXNzb3IiLCJVfrvonD",
    "https://192.168.68.101:5175",
    "https://192.168.68.101:5173",
    "https://192.168.68.101:5175/ZXNzb3IiLCJVfrvonD",
    "https://192.168.68.101:5175/admin",
    "https://192.168.68.103:5173",
    "https://192.168.68.102:5173",
    "https://192.168.31.25:5173",
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

// Routers
const studentRouter = require("./routes/studentRouter.js");
const professorRouter = require("./routes/professorRouter.js");
const adminRouter = require("./routes/adminRouter.js");
app.use("/api/student", studentRouter);
app.use("/api/professor", professorRouter);
app.use("/api/admin", adminRouter);

app.use("/", (req, res) => {
  res.send("server is yey mais running");
});

// Cron Job
cron.schedule("*/13 * * * *", async () => {
  try {
    // Data to be sent to the loginAdmin endpoint (make sure this is the correct login data)
    const data = {
      username: "admin",
      password: "admin",
    };

    // Send a POST request to the loginAdmin endpoint to simulate a "ping"
    const response = await axios.post(
      "https://scanmatic-backend.onrender.com/api/admin/loginAdmin",
      data
    );

    // Log the successful response
    console.log(
      `Server pinged successfully: ${response.status} ${response.data.message}`
    );
  } catch (error) {
    console.error("Ping error:", error);
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
