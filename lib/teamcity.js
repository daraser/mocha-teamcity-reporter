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

  runner.on('start', function(suite) {
    console.log("##teamcity[testSuiteStarted name='name']");
  });

  runner.on('test', function(test) {
    console.log("##teamcity[testStarted name='" + escape(test.title) + "' captureStandardOutput='true']");
  });

  runner.on('fail', function(test, err) {
    console.log("##teamcity[testFailed name='" + escape(test.title) + "' message='" + escape(err.message) + "' captureStandardOutput='true']" + "\n##teamcity[testSuiteFinished name='#" + escape(test.title) + "' duration='" + test.duration + "']");
  });

  runner.on('pending', function(test) {
   console.log("##teamcity[testIgnored name='" + escape(test.title) + "' message='pending']"+"\n##teamcity[testSuiteFinished name='#" + escape(test.title) + "' duration='" + test.duration + "']");
  });

  runner.on('pass', function(test) {
    console.log("##teamcity[testFinished name='" + escape(test.title) + "' duration='" + test.duration + "']");
  });


  
  runner.on('end',function(){
      console.log("##teamcity[testSuiteFinished name='name' duration='" + stats.duration + "']");
      self.epilogue();
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
