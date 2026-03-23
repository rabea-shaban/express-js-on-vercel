const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized: Authorization header missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: Token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    console.log("AUTH OK");

    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    console.log("SECRET:", process.env.JWT_SECRET);
    console.log("Token:", req.headers.authorization);
    console.log("Error:", error);
    // console.log("HEADER:", authHeader);
    // console.log("TOKEN:", token);
    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token",
    });
  }
};
module.exports = auth;
