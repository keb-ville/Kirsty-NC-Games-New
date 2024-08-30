const usersRouter = require("express").Router();

const { getUsers, getUserByUsername } = require("../controllers/controller");

usersRouter.get("/", getUsers);
//TASK 16
usersRouter.get("/:username", getUserByUsername);

module.exports = usersRouter;
