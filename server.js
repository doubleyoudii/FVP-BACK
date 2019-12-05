require("./config/config");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Connected Hayzxczx");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
