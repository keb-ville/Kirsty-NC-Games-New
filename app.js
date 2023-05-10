const express = require("express");
const {
  handlePsqlErrors,
  handle400Errors,
  handle404Errors,
} = require("./controllers/error-controller");

const app = express();

const {
  getCategories,
  getApi,
  getReviewById,
} = require("./controllers/controller");

//TASK 3
app.get("/api", getApi);
//TASK 3.5
app.get("/api/categories", getCategories);
//TASK 4
app.get("/api/reviews/:review_id", getReviewById);
//TASK 5
// app.get("/api/reviews", getReviews);

//ERROR HANDLING
app.use(handlePsqlErrors);
app.use(handle400Errors);
app.use(handle404Errors);

module.exports = { app };
