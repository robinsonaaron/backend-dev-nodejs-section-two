module.exports = (logger) => {
  return (req, res, next) => {
    req.log = logger;
    next();
  };
};
