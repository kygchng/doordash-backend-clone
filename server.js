const express = require("express"); //backend framework
const morgan = require("morgan"); //logger
const helmet = require("helmet"); //makes API requests more secure
const bodyParser = require("body-parser"); //makes API request into a JSON


const connectDB = require("./db"); //   ./ means you are in the current folder, db = name of the folder
const dashboard = require("./routes/api/dashboard");

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({ extended: false })); //takes in network request and turns it into a JSON
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // * = give access to anyone (front end app) who calls backend
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS, DELETE'); // these requests are allowed
  next();
});

app.use(morgan("dev"));
app.use(helmet());
connectDB();
app.use("/api/v1/dashboard", dashboard);
//// http://localhost:5000/api/v1/dashboard/restaurant/register
//// http://localhost:5000/api/v1/dashboard/fetch/restaurants
//// http://localhost:5000/api/v1/dashboard/fetch/restaurant/:email
//// http://localhost:5000/api/v1/dashboard/update/restaurant
//// http://localhost:5000/api/v1/dashboard/add/menu

app.listen(port, () => console.log(`API server listening on ${port}`));

