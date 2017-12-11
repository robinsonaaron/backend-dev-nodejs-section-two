const router = require('express').Router();
const dashboardCtrl = require('./dashboard.ctrl');
const dashboardService = require('../services/dashboard.service');
const accountCtrl = require('./account.ctrl');
const accountService = require('../services/account.service');
const custSatisfactionService = require('../services/cust-satisfaction.service');

router.get('/dashboard', dashboardCtrl(dashboardService));
router.get('/:accountNbr', accountCtrl(accountService, custSatisfactionService));

module.exports = router;
