var env = process.env.NODE_ENV || "development";
console.log("env *******", env);

if (env === "development" || env === "test") {
  var config = require("./config.json");
  var envConfig = config[env];

  Object.keys(envConfig).forEach(key => {
    process.env[key] = envConfig[key];
  });
}

/*


config.json format

{
  "test": {
    "PORT": 3000,
    "MONGODB_URI": "Put your **TEST**database here",
    "JWT_SALT": "Put your **TEST** secret key heare"
  },
  "development": {
    "PORT": 3000,
    "MONGODB_URI": "Put your **PROD** database here",
    "JWT_SALT": "Put your **PROD** secret key heare"
  }
}


*/
