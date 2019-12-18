const morgan = require("morgan");
const cors = require("cors");
const env = require("dotenv");
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const os = require("os");
// const connect = require("connect");
// const http = require("http");
env.config();
const connectionString = process.env.MONGO_CONNECTION;
const connector = mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("db connected succesfuly");
  })
  .catch(error => {
    console.log(error);
  });

const app = express();

app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyparser.json());
// import routes
const users = require("./routes/users");
const quotes = require("./routes/quotes");
const services = require("./routes/services");
var port;
var mode;
if (os.hostname().indexOf("BinnyLaptop" || "Macmini") > -1) {
  mode = "dev";
  port = process.env.DEV_PORT || 5000;
} else {
  mode = "prod";
  port = process.env.PORT || 3000;
}
// set routes
app.use(morgan(mode));
app.use("/users", users);
app.use("/quotes", quotes);
app.use("/services", services);
app.listen(port, "0.0.0.0", () => console.log("listening " + port));

module.exports = app;
