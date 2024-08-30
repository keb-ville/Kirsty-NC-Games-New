const commentsRouter = require("express").Router();

const {
  deleteComment,
  updateVotesByCommentId,
} = require("../controllers/controller");

commentsRouter.delete("/:comment_id", deleteComment);
//TASK 17
commentsRouter.patch("/:comment_id", updateVotesByCommentId);

module.exports = commentsRouter;
