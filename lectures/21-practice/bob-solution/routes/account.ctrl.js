module.exports = (accountService, custSatisfactionService) => {
  return (req, res, next) => {
    req.log.info('GET /account/' + req.params.accountNbr);
    return Promise.all([
      accountService.getAccountData(req.params.accountNbr),
      custSatisfactionService.getSatisfactionData()
    ])
      .then(accountService.formatAccountData)
      .then((accountData) => {
        req.log.debug(`Data for account #${req.params.accountNbr} : ${accountData}`);
        res.status(200).json(accountData);
      })
      .catch(next);
  };
};
