const reviewsRouter = require("express").Router();

const {
  getReviewById,
  //   getCommentsByReviewId,
  getReviews,
  getReviewComments,
  postNewComment,
  updateVotesById,
  postNewReview,
} = require("../controllers/controller");

reviewsRouter.get("/", getReviews);
reviewsRouter.get("/:review_id", getReviewById);
reviewsRouter.get("/:review_id/comments", getReviewComments);
reviewsRouter.post("/:review_id/comments", postNewComment);
reviewsRouter.post("/", postNewReview);
reviewsRouter.patch("/:review_id", updateVotesById);

module.exports = reviewsRouter;
