module.exports = (dashboardService) => {
  return (req, res, next) => {
    req.log.info('GET /dashboard');
    return dashboardService.queryDashboard()
      .then(dashboardService.composeDashboardData)
      .then((dashboard) => {
        req.log.debug(`Dashboard data: ${dashboard}`);
        res.status(200).json(dashboard);
      })
      .catch(next);
  };
};
