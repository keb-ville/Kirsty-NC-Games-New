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
  getReviews,
  getReviewComments,
  postNewComment,
  updateVotesById,
  deleteComment,
  getUsers,
} = require("./controllers/controller");

app.use(express.json());
//TASK 3
app.get("/api", getApi);
//TASK 3.5
app.get("/api/categories", getCategories);
//TASK 4
app.get("/api/reviews/:review_id", getReviewById);
//TASK 5
app.get("/api/reviews", getReviews);
///TASK 6
app.get("/api/reviews/:review_id/comments", getReviewComments);
///TASK 7
app.post("/api/reviews/:review_id/comments", postNewComment);
///TASK 8
app.patch("/api/reviews/:review_id", updateVotesById);
//TASK 9
app.delete("/api/comments/:comment_id", deleteComment);
//TASK 10
app.get("/api/users", getUsers);

//ERROR HANDLING
app.use(handlePsqlErrors);
app.use(handle400Errors);
app.use(handle404Errors);

module.exports = { app };
