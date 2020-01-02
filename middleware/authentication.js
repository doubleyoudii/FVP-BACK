const jwt = require("jsonwebtoken");
const jwtSimple = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  //Do something in Token

  // const bearerHeader = req.header("authorization");
  // if (bearerHeader !== undefined) {
  //   const bearer = bearerHeader.split(" ");
  //   const bearerToken = bearer[1];
  //   req.body.token = bearerToken;

  //   jwt.verify(req.body.token, process.env.JWT_SALT, async (err, authData) => {
  //     if (err) {
  //       res.status(403).json({
  //         message: "Forbidden"
  //       });
  //     } else {
  //       req.body.user = authData;
  //       next();
  //     }
  //   });
  // } else {
  //   res.status(403).json({
  //     message: "Forbidden "
  //   });
  // }
  next();
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

const authenticateLogin = (req, res, next) => {
  //Do something in Token

  const bearerHeader = req.header("authorization");
  if (bearerHeader !== undefined) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.body.token = bearerToken;

    jwt.verify(
      req.body.token,
      process.env.JWT_SALT_LOGIN,
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

const authenticateUpload = (req, res, next) => {
  //Do something in Token

  const bearerHeader = req.header("authorization");
  if (bearerHeader !== undefined) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.body.token = bearerToken;

    const imgData = jwtSimple.decode(req.body.token, "upload");
    if (imgData.imageId === undefined || imgData.name === undefined) {
      res.status(403).json({
        message: "Please Upload imgae Again"
      });
    }
    req.body.imageData = imgData;
    next();
  } else {
    res.status(403).json({
      message: "Forbidden "
    });
  }
  // next();
};

module.exports = {
  authenticate,
  authenticateActivate,
  authenticateLogin,
  authenticateUpload
};
