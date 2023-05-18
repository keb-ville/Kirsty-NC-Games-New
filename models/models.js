const db = require("../db/connection");

////TASK 3
exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories`).then(({ rows }) => {
    return rows;
  });
};
///////TASK 4
exports.fetchReviewById = (id) => {
  return db
    .query(`SELECT * FROM reviews WHERE reviews.review_id = $1;`, [id])
    .then((result) => {
      if (result.rows.length === 0) {
        //don't have !NaN
        return Promise.reject({
          status: 404,
          msg: `No review found for review_id ${id}`,
        });
      }
      return result.rows[0];
    });
};
//////TASK 5
exports.fetchReviews = () => {
  return db
    .query(
      `SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.review_id)::INT as comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id ORDER BY reviews.created_at DESC;`
    )
    .then((response) => {
      return response.rows;
    });
}; //select columns from the joined tables
//it calculates the number of comments for each review using COUNT and adds this result to comment count
//left join will join the reviews table with the comments table using the review_id column
//GROUP BY groups results by the review_id column. the query will calculate the num of comments for each review so results need to be grouped by review_id to aggregate the comments correctly
//ORDER BY specifies the order in which the results will be sorted

//////TASK 6
exports.fetchCommentsByReviewId = (fetchedComments) => {
  return db
    .query(
      `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`,
      [fetchedComments.review_id]
    )
    .then((response) => {
      if (!response.rows.length) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }
      return response.rows;
    });
};
////////TASK 7
exports.createComment = (username, body, reviewId) => {
  return db
    .query(
      `INSERT INTO comments (review_id, author, body)
      VALUES ($1, $2, $3)
      RETURNING*;`,
      [reviewId, username, body]
    )
    .then((response) => {
      return response.rows[0];
    });
};
/////TASK 8
exports.patchVotesById = (inc_votes, reviewId) => {

  return db
    .query(
      `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING*;`,
      [inc_votes, reviewId]
    )
    .then((response) => {
      if (!response.rows.length) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }
      return response.rows[0];
    });
};
