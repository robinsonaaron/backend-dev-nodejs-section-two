const request = require('request-promise');

module.exports = {
  getSatisfactionData,
  authHeaderVal: '8bfde0b5-307d-4621-b032-b82643fc2420',
  authUsername: 'user',
  authPassword: '77658e85-1add-41e2-945f-9ac4f0f81922',
  configure,
  logger: null
};

function configure(logger) {
  this.logger = logger.child({ service: 'cust-satisfaction' });
}

function getSatisfactionData() {
  this.logger.debug('Requesting satifisfaction data...');
  return request({
    url: 'https://bob-ftodgd-185818.appspot.com/appreciate',
    headers: {
      'BANK-OF-BACKENDDEV-AUTH': '8bfde0b5-307d-4621-b032-b82643fc2420',
      'BANK-OF-BACKENDDEV-USERNAME': 'user',
      'BANK-OF-BACKENDDEV-PASSWORD': '77658e85-1add-41e2-945f-9ac4f0f81922'
    }
  })
  .then((results) => {
    return Promise.resolve(results);
  })
  .catch((err) => {
    return Promise.resolve('');
  });
}
