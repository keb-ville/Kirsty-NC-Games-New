const apiRouter = require("express").Router();

const { getApi } = require("../controllers/controller");
const categoriesRouter = require("./categories-router");
const usersRouter = require("./users-router");
const commentsRouter = require("./comments-router");
const reviewsRouter = require("./reviews-router");

apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/reviews", reviewsRouter);

apiRouter.get("/", getApi);

module.exports = apiRouter;
