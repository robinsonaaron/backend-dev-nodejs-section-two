const bunyan = require('bunyan');
const _ = require('lodash');

module.exports = function (env) {
  if (process.env.TESTS === 'true') {
    return {
      debug: _.noop,
      info: _.noop,
      warn: _.noop,
      error: _.noop,
      child: _.noop
    };
  }

  return bunyan.createLogger({
    name: 'bob-api',
    streams: determineStreams(env),
    serializers: bunyan.stdSerializers
  });
};

function determineStreams(env) {
  if (env === 'prod') {
    return [{ level: 'warn', path: './bob-error.log' }];
  }

  return [{ level: 'debug', stream: process.stdout }];
}
