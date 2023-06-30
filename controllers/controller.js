const {
  fetchCategories,
  fetchReviewById,
  fetchReviews,
  fetchCommentsByReviewId,
  createComment,
  patchVotesById,
  deleteCommentById,
  fetchUsers,
} = require("../models/models");

const endpoints = require("../endpoints.json");
///////TASK 3.5
exports.getApi = (req, res) => {
  res.status(200).send({ endpoints }); //send back the endpoints
  //destructure to get the key and value
};
//////TASK 3
exports.getCategories = (req, res, next) => {
  return fetchCategories()
    .then((categories) => {
      res.status(200).send({ categories: categories });
    })
    .catch((err) => {
      next(err);
    });
};
//////TASK 4 ///TASK 12
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
/////TASK 12
exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const reviewIdPromise = fetchReviewById(review_id);
  const commentsPromise = fetchCommentsByReviewId(review_id);

  Promise.all([commentsPromise, reviewIdPromise])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
////////TASK 5 AND TASK 11
exports.getReviews = (req, res, next) => {
  const { sort_by, order_by, category } = req.query; // destructuring id from params
  fetchReviews(sort_by, order_by, category)
    .then((reviews) => {
      res.status(200).send({ reviews }); //send back the reviews with appropriate key
    })
    .catch((err) => {
      // console.log(err, "ERROR");
      next(err);
    });
}; //catch block is functionally redundant for ticket 5 - needs to be added for 11
///////TASK 6
exports.getReviewComments = (req, res, next) => {
  const review = req.params;
  fetchCommentsByReviewId(review)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};
///////TASK 7
exports.postNewComment = (req, res, next) => {
  const { username, body } = req.body;
  const reviewId = req.params.review_id;
  if (!username || !body) {
    return res.status(400).send({ message: "Invalid Request" });
  }
  createComment(username, body, reviewId)
    .then((createdComment) => {
      res.status(201).send(createdComment);
    })
    .catch(next);
};
///////TASK 8
exports.updateVotesById = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  patchVotesById(inc_votes, review_id)
    .then((updatedReview) => {
      res.status(200).send(updatedReview);
    })
    .catch((err) => {
      next(err);
    });
};
///////TASK 9
exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  return deleteCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
///////TASK 10
exports.getUsers = (req, res, next) => {
  return fetchUsers()
    .then((users) => {
      res.status(200).send({ users: users });
    })
    .catch((err) => {
      next(err);
    });
};
