const categoriesRouter = require("express").Router();

categoriesRouter.get("/", (req, res) => {
  res.status(200).send("All OK from /api/categories");
});

module.exports = categoriesRouter;
