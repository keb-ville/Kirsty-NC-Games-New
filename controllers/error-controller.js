exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code === "22P02" || err.code === "23502") {
      res.status(400).send({ message: "400 - Bad request" });
    } else {
      next(err);
    }
  };

exports.handle400Errors = (err, req, res, next) => {
  if (err === "Invalid Request") {
    console.log("400", err);
    res.status(400).send({ msg: "Invalid Request" });
  } else next(err);
};

exports.handle404Errors = (err, req, res, next) => {
  if (err === "Not Found") {
    console.log("404", err);
    res.status(404).send({ msg: "Not Found" });
  } else next(err);
};

exports.handle500Error = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "server error" });
};
