const jwt = require("jsonwebtoken");
const authorizeMiddleware = (req, res, next) => {
const authHeader = req.headers["authorization"];

  if (authHeader) {
    const tokenParts = authHeader.split(" ");

    if (tokenParts.length === 2 && tokenParts[0].toLowerCase() === "bearer") {
      const token = tokenParts[1];

      try {
        const decoded = jwt.verify(token, "abc");
        req.user = decoded;
        next(); // Continue to the next middleware or route handler
      } catch (error) {
        res.status(401).json({ message: "Invalid token" });
      }
    } else {
      res.status(401).json({ message: "Invalid authorization header format" });
    }
  } else {
    res.status(401).json({ message: "Authorization header not provided" });
  }
};


module.exports = authorizeMiddleware;
