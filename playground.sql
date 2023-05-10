\c nc_games
"SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews 
        LEFT JOIN comments 
        ON reviews.review_id = comments.review_id WHERE reviews.review_id = 3
        GROUP BY reviews.review_id;"