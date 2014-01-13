/**
 * Module dependencies.
 */

var Base = require('mocha').reporters.Base;

/**
 * Expose `Teamcity`.
 */

exports = module.exports = Teamcity;

/**
 * Initialize a new `Teamcity` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Teamcity(runner) {
  Base.call(this, runner);
  var stats = this.stats;
  var self = this;

  runner.on('suite', function(suite) {
    process.stdout.write("##teamcity[testSuiteStarted name='#" + escape(suite.title) + "']"+ '\n');
  });

  runner.on('test', function(test) {
    process.stdout.write("##teamcity[testStarted name='@" + escape(test.title) + "' captureStandardOutput='true']"+ '\n');
  });

  runner.on('fail', function(test, err) {
    process.stdout.write("##teamcity[testFailed name='@" + escape(test.title) + "' message='" + escape(err.message) + "' captureStandardOutput='true']" + "\n##teamcity[testSuiteFinished name='#" + escape(test.title) + "' duration='" + test.duration + "']"+ '\n');
  });

  runner.on('pending', function(test) {
    process.stdout.write("##teamcity[testIgnored name='@" + escape(test.title) + "' message='pending']"+"\n##teamcity[testSuiteFinished name='#" + escape(test.title) + "' duration='" + test.duration + "']"+ '\n');
  });

  runner.on('pass', function(test) {
    process.stdout.write("##teamcity[testFinished name='@" + escape(test.title) + "' duration='" + test.duration + "']"+ '\n');
  });

  runner.on('suite end', function(suite) {
    process.stdout.write("##teamcity[testSuiteFinished name='#" + escape(suite.title) + "' duration='" + stats.duration + "']"+ '\n');
  });

  runner.on('end', function() {
    runner.on('end', self.epilogue.bind(self));
  });
}


/**
 * Inherit from `Base.prototype`.
 */

Teamcity.prototype.__proto__ = Base.prototype;

/**
 * Escape the given `str`.
 */

function escape(str) {
  if (!str) return '';
  return str
    .replace(/\|/g, "||")
    .replace(/\n/g, "|n")
    .replace(/\r/g, "|r")
    .replace(/\[/g, "|[")
    .replace(/\]/g, "|]")
    .replace(/\u0085/g, "|x")
    .replace(/\u2028/g, "|l")
    .replace(/\u2029/g, "|p")
    .replace(/'/g, "|'");
}
