module.exports = (err, req, res) => {
  var msg = `Internal server error: ${JSON.stringify(err)}`;

  req.log.error(msg, req.params);
  res.status(500).send(msg);
};
