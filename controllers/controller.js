const {
  fetchCategories,
  fetchReviewById,
  fetchReviews,
  fetchCommentsByReviewId,
} = require("../models/models");
const endpoints = require("../endpoints.json");
/////TASK 3.5
exports.getApi = (req, res, next) => {
  res.status(200).send({ endpoints }); //send back the endpoints
  //destructure to get the key and value
};
/////TASK 3
exports.getCategories = (req, res, next) => {
  return fetchCategories()
    .then((categories) => {
      res.status(200).send({ categories: categories });
    })
    .catch((err) => {
      next(err);
    });
};
////TASK 4
exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params; // destructuring id from params
  fetchReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
//////TASK 5
exports.getReviews = (req, res, next) => {
  const { sort_by } = req.query; // destructuring id from params
  fetchReviews(sort_by) //fetch the reviews
    .then((reviews) => {
      res.status(200).send({ reviews }); //send back the reviews with appropriate key
    })
    .catch((err) => {
      next(err);
    });
};
///////TASK 6
exports.getReviewComments = (req, res, next) => {
  const review = req.params;
  fetchCommentsByReviewId(review)
    .then((comments) => {
      console.log(comments, "COMMENTSSSSSS");
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};
