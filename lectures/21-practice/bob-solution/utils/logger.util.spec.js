const chai = require('chai');
const _ = require('lodash');

const logger = require('./logger.util');

const expect = chai.expect;

describe('Logger Utility', () => {
  it('should be a function', () => {
    expect(logger).to.be.a('function');
  });
  it('should return a mock logger when env.TESTS === true', () => {
    const expectedResult = {
      debug: _.noop,
      info: _.noop,
      warn: _.noop,
      error: _.noop,
      child: _.noop
    };
    const result = logger();
    expect(result).to.be.an('object');
    expect(result).to.deep.equal(expectedResult);
  });

  it('should return a bunyan logger that writes to a file when env === prod', () => {
    process.env.TESTS = 'false';
    const result = logger('prod');
    expect(result).to.be.an('object');
    expect(result.streams[0].level).to.equal(40);
    expect(result.streams[0].path).to.equal('./bob-error.log');
    expect(result.streams[0].type).to.equal('file');
    process.env.TESTS = 'true';
  });

  it('should return a bunyan logger that writes to a file when env === prod', () => {
    process.env.TESTS = 'false';
    const result = logger('dev');
    expect(result).to.be.an('object');
    expect(result.streams[0].level).to.equal(20);
    expect(result.streams[0].stream).to.equal(process.stdout);
    expect(result.streams[0].type).to.equal('stream');
    process.env.TESTS = 'true';
  });
});
