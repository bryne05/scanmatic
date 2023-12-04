const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateProfToken = (req, res, next) => {
  const token = req.headers.proftoken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.prof_id = decoded.prof_id;
    next();
  });
};

const authenticateStudToken = (req, res, next) => {
  const token = req.headers.studtoken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.stud_id = decoded.stud_id;
    req.courseYearSection = decoded.courseYearSection;

    next();
  });
};

module.exports = {
  authenticateProfToken,
  authenticateStudToken,
};
