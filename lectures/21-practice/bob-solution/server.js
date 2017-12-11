require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const mongodb = require('./utils/mongo.util');
const createLogger = require('./utils/logger.util');
const reqLogMiddleware = require('./middleware/req-log.mw');
const err500Middleware = require('./middleware/error/500.mw');
const accountService = require('./services/account.service');
const custSatisfactionService = require('./services/cust-satisfaction.service');
const dashboardService = require('./services/dashboard.service');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;
const env = (process.env.PROD === 'true') ? 'prod' : 'dev';
const logger = createLogger(env);

accountService.configure(logger);
custSatisfactionService.configure(logger);
dashboardService.configure(logger);

mongodb.createEventListeners(logger);
mongodb.connect();

app.use(reqLogMiddleware(logger));
app.use(bodyParser.json());
app.use('/', routes);
app.use(err500Middleware);

app.listen(port, function () {
  logger.info('Listening on port ' + port + '...');
});

module.exports = app;
