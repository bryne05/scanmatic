const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const axios = require("axios");
const http = require("http"); // Required for WebSocket
const WebSocket = require("ws");
const db = require("./models");
require("dotenv").config();

const app = express();
const server = http.createServer(app); // Attach HTTP server for WebSockets
const wss = new WebSocket.Server({ server }); // Attach WebSocket to the same server

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
    "https://192.168.232.48:5173",
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

// WebSocket Handling

const jwt = require("jsonwebtoken");
const students = new Map(); // Store student WebSocket connections
const scanners = new Set(); // Store scanner WebSockets

wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  ws.on("message", (message) => {
    try {
      console.log("📩 Raw Message Received:", message); // Debug incoming data

      const data = JSON.parse(message);
      console.log("📌 Parsed Message:", data);
      //  When a student connects, they send their token
      if (data.token) {
        const decoded = jwt.verify(data.token, process.env.TOKEN);
        const studentId = decoded.stud_id;

        students.set(studentId, ws); // Store student connection
        console.log(`Student ${studentId} connected via WebSocket`);
        return;
      }

      //  When a scanner (HelloWorld.vue) sends a QR scan event
      if (data.qrCode && data.subject_id) {
        console.log("Scanner detected a QR code:", data.qrCode);
        console.log("Received Subject ID:", data.subject_id);

        try {
          //  First, decode the QR code (which is a JWT token)
          const decodedQR = jwt.verify(data.qrCode, process.env.TOKEN);
          const targetStudentId = decodedQR.stud_id; // Extract student ID

          console.log(`Decoded Student ID: ${targetStudentId}`);

          //  Now check if this student is connected
          if (students.has(targetStudentId)) {
            const targetWs = students.get(targetStudentId);

            //  Ensure WebSocket is open before sending
            if (targetWs && targetWs.readyState === WebSocket.OPEN) {
              targetWs.send(
                JSON.stringify({
                  qrCode: data.qrCode,
                  subject_id: data.subject_id,
                })
              );
              console.log(
                ` Sent QR Code and Subject ID to student ${targetStudentId}`
              );
            } else {
              console.warn(
                ` WebSocket for student ${targetStudentId} is not open.`
              );
            }
          } else {
            console.warn(
              ` No active student connection found for ${targetStudentId}`
            );
          }
        } catch (error) {
          console.error(" Error decoding QR code JWT:", error.message);
        }

        return;
      }

      //  If HelloWorld.vue wants to register as a scanner
      if (data.type === "scanner") {
        scanners.add(ws); // Store scanner WebSocket
        console.log("Scanner connected via WebSocket");
      }
    } catch (error) {
      console.error("Invalid message received:", message, error);
    }
  });

  ws.on("close", () => {
    // Remove disconnected students and scanners
    for (const [studentId, clientWs] of students.entries()) {
      if (clientWs === ws) {
        students.delete(studentId);
        console.log(`Student ${studentId} disconnected`);
        break;
      }
    }

    if (scanners.has(ws)) {
      scanners.delete(ws);
      console.log("Scanner disconnected");
    }
  });
});

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
    const data = { username: "admin", password: "admin" };
    const response = await axios.post(
      "https://scanmatic-backend.onrender.com/api/admin/loginAdmin",
      data
    );
    console.log(
      `Server pinged successfully: ${response.status} ${response.data.message}`
    );
  } catch (error) {
    console.error("Ping error:", error);
  }
});

// Start Server with WebSockets
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
