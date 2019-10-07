const morgan = require("morgan");
const cors = require("cors");
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

const connectionString =
  "mongodb+srv://binny:xB7xGHp0GAQzTHqF@maincluster-pyapv.mongodb.net/Quets?retryWrites=true&w=majority";
const connector = mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});
app.use(bodyparser.json());
// import routes
const users = require("./routes/users");
const quotes = require("./routes/quotes");
const services = require("./routes/services");

// set routes
app.use(morgan("dev"));
app.use("/users", users);
app.use("/quotes", quotes);
app.use("/services", services);
app.listen(80, "0.0.0.0", () => console.log("listening"));

module.exports = app;
