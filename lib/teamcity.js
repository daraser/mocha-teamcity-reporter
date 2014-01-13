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

  runner.on('suite', function(suite) {
    if (suite.root) return;
    console.log("##teamcity[testSuiteStarted name='#" + escape(suite.title) + "']");
  });

  runner.on('test', function(test) {
    console.log("##teamcity[testStarted name='@" + escape(test.title) + "' captureStandardOutput='true']");
  });

  runner.on('fail', function(test, err) {
    console.log("##teamcity[testFailed name='@" + escape(test.title) + "' message='" + escape(err.message) + "' captureStandardOutput='true']" + "\n##teamcity[testSuiteFinished name='#" + escape(test.title) + "' duration='" + test.duration + "']");
  });

  runner.on('pending', function(test) {
    console.log("##teamcity[testIgnored name='@" + escape(test.title) + "' message='pending']"+"\n##teamcity[testSuiteFinished name='#" + escape(test.title) + "' duration='" + test.duration + "']");
  });

  runner.on('test end', function(test) {
    console.log("##teamcity[testFinished name='@" + escape(test.title) + "' duration='" + test.duration + "']");
  });

  runner.on('suite end', function(suite) {
    if (suite.root) return;
    console.log("##teamcity[testSuiteFinished name='#" + escape(suite.title) + "' duration='" + stats.duration + "']");
  });

  runner.on('end', function() {
    console.log("##teamcity[testSuiteFinished name='mocha.suite' duration='" + stats.duration + "']");
  });
}

/*


 runner.on('start', function(){
    stats.start = new Date;
  });

  runner.on('suite', function(suite){
    stats.suites = stats.suites || 0;
    suite.root || stats.suites++;
  });

  runner.on('test end', function(test){
    stats.tests = stats.tests || 0;
    stats.tests++;
  });

  runner.on('pass', function(test){
    stats.passes = stats.passes || 0;

    var medium = test.slow() / 2;
    test.speed = test.duration > test.slow()
      ? 'slow'
      : test.duration > medium
        ? 'medium'
        : 'fast';

    stats.passes++;
  });

  runner.on('fail', function(test, err){
    stats.failures = stats.failures || 0;
    stats.failures++;
    test.err = err;
    failures.push(test);
  });

  runner.on('end', function(){
    stats.end = new Date;
    stats.duration = new Date - stats.start;
  });

  runner.on('pending', function(){
    stats.pending++;
  });
*/
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
