const db = require("../db/connection");

////TASK 3
exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories`).then(({ rows }) => {
    return rows;
  });
};
///////TASK 4 - SELECT * FROM reviews WHERE review_id = $1
////TASK 12 - added ORDER BY comments.created_at DESC to SQL query
exports.fetchReviewById = (id) => {
  return db
    .query(
      `
      SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id
      `,
      [id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No review found for review_id ${id}`,
        });
      }
      return result.rows[0];
    });
};
//////TASK 12
exports.fetchCommentsByReviewId = (id) => {
  return db
    .query(
      `
  SELECT * FROM comments
  WHERE review_id = $1
  ORDER BY created_at DESC
  `,
      [id]
    )
    .then((result) => {
      return result.rows;
    });
};
////////TASK 5
//r.votes r.owner - this is allowed - it's a simple practice in SQL - keeps the query brief
//r and c are aliases in SQL

// exports.fetchReviews = () => {
//   return db
//     .query(
//       `SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.review_id)::INT as comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id ORDER BY reviews.created_at DESC;`
//     )
//     .then((response) => {
//       return response.rows;
//     });
// };
/////TASK 11
exports.fetchReviews = (
  sort_by = "created_at",
  order_by = "DESC",
  category
) => {
  return db
    .query(`SELECT slug FROM categories`)
    .then((result) => {
      const categoryArr = result.rows;
      const categories = categoryArr.map((category) => {
        return category.slug;
      });
      return categories;
    })
    .then((validCategory) => {
      const validSortBy = ["created_at", "votes", "comment_count"];
      const validOrderBy = ["asc", "desc", "ASC", "DESC"];

      if (
        (sort_by && !validSortBy.includes(sort_by)) ||
        (order_by && !validOrderBy.includes(order_by))
      ) {
        return Promise.reject({
          status: 400,
          msg: "Invalid Request",
        });
      }

      if (category && !validCategory.includes(category)) {
        return Promise.reject({
          status: 404,
          msg: "Not Found",
        });
      }
      //if the promise.rejects aren't here, it will throw another SQL error that is not caught in the error handling middleware
      //you need to create a custom error to resolve in if logics
      let queryString =
        "SELECT reviews.*, COUNT(comments.review_id)::INT AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id ";
      const selectedCategory = category;
      const sorted = sort_by; //|| 'created_at' this is if you don't set them as default
      const ordered = order_by;
      const queryInputs = [];
      if (selectedCategory) {
        queryInputs.push(selectedCategory);
        queryString += `WHERE reviews.category = $1`;
      }
      queryString += ` GROUP BY reviews.review_id ORDER BY reviews.${sorted} ${ordered};`;
      return db.query(queryString, queryInputs);
    })
    .then((result) => {
      return result.rows;
    });
};
////////TASK 6
exports.fetchCommentsByReviewId = (fetchedComments) => {
  return db
    .query(
      `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`,
      [fetchedComments.review_id]
    )
    .then((response) => {
      // if (!response.rows.length) {
      //   return Promise.reject({ status: 404, message: "Not Found" });
      // } this is not needed as no comments isn't a 404, it's a 200
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
////////TASK 9
exports.deleteCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
    .then((response) => {
      if (response.rowCount === 0) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }
    });
};
////TASK 10
exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};
