const db = require("../db/connection");
const { Promise } = require("../db/connection");
////TASK 3
exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchReviewById = (review_id) => {
  //req.params what user puts in after slash
  return db
    .query(`SELECT * FROM reviews WHERE reviews.review_id = $1;`, [review_id])
    .then((result) => {
      if (!result.rows === 0) {
        return Promise.reject({ status: 404,
          msg: `No review found for review_id ${review_id}`,
        });
      }
      return result.rows[0];
    });
};
