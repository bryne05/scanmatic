const express = require("express");
const cors = require("cors");

const app = express();

require("dotenv").config();

//Port
const PORT = process.env.PORT || 5000;

var corsOptions = {
  origin: [
    `https://localhost:${PORT}`,
    "https://192.168.46.48:5173",
    "https://192.168.100.8:5173",
  ],
};

//Middlewares
app.use(cors(corsOptions));
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
