const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader && authHeader.split(" ")[1];
  accessToken ?? res.status(402).send("Hello");

  if (accessToken) {
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(401).send("gagal");
      req.user = user;
      next();
    });
  }
};

module.exports = authenticateToken;
