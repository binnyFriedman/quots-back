const morgan = require("morgan");
const cors = require("cors");

const config = {
  views: "views", // Set views directory
  static: "public", // Set static assets directory
  enableAuth: true,
  db: {
    // Database configuration. Remember to set env variables in .env file: MONGODB_URI, PROD_MONGODB_URI
    url:
      process.env.TURBO_ENV == "dev"
        ? process.env.MONGODB_URI
        : process.env.PROD_MONGODB_URI,
    type: "mongo",
    onError: err => {
      console.log("DB Connection Failed!");
    },
    onSuccess: () => {
      console.log("DB Successfully Connected!");
    },
  },
};

app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

// import routes
const index = require("./routes/index");
const api = require("./routes/api");
const users = require("./routes/users");
const quotes = require("./routes/quotes");
const services = require("./routes/services");

// set routes
app.use(morgan("dev"));
app.use("/", index);
app.use("/users", users);
app.use("/quotes", quotes);
app.use("/services", services);
module.exports = app;
