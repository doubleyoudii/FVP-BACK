const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  //Do something in Token

  const bearerHeader = req.header("authorization");
  if (bearerHeader !== undefined) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.body.token = bearerToken;

    jwt.verify(req.body.token, process.env.JWT_SALT, async (err, authData) => {
      if (err) {
        res.status(403).json({
          message: "Forbidden"
        });
      } else {
        req.body.user = authData;
        next();
      }
    });
  } else {
    res.status(403).json({
      message: "Forbidden "
    });
  }
  // next();
};

const authenticateActivate = (req, res, next) => {
  //Do something in Token

  const bearerHeader = req.header("authorization");
  if (bearerHeader !== undefined) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.body.token = bearerToken;

    jwt.verify(
      req.body.token,
      process.env.JWT_SALT_ACTIVATE,
      async (err, authData) => {
        if (err) {
          res.status(403).json({
            message: "Forbidden"
          });
        } else {
          req.body.user = authData;
          next();
        }
      }
    );
  } else {
    res.status(403).json({
      message: "Forbidden "
    });
  }
  // next();
};

module.exports = { authenticate, authenticateActivate };
