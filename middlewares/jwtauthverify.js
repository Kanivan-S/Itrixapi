const jwt = require("jsonwebtoken");
const logger = require('../utils/log')(module);

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["access-token"];
    const token = authHeader;
    if (token == null) return res.sendStatus(401);
    try {
      jwt.verify(token, process.env.JWT_SECRET_KEY);
      next();
    } catch (err) {
      res.sendStatus(403);
    }
  } catch (err) {
    logger.info(err);
    res.sendStatus(500);
  }
};

module.exports = {
  authenticateToken,
};
