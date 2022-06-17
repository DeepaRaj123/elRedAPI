module.exports = (req, res, next) => {
    if (req.session.isAuth) {
      next();
    } else {
      res.send("Your session expired!, Please login again!");
    }
  };
  