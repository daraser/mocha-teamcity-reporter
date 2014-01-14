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
  var buffer = [];
  var suites = {};
  var names = [];
  var lastSuite = null;


  runner.on('start', function(suite) {
  });

  runner.on('suite', function(suite) {
     if(suite.root) return;
     buffer.push("##teamcity[testSuiteStarted name='" + escape(suite.title) + "' captureStandardOutput='true']");
     suites[suite.title] = new Date();
     names.push(suite.title);
     lastSuite = suite;
  });

  runner.on('test', function(test) {
    buffer.push("##teamcity[testStarted name='" + escape(test.title) + "' captureStandardOutput='true']");
  });

  runner.on('fail', function(test, err) {
    if(lastSuite != null){
      buffer.push("##teamcity[testFailed name='" + escape(test.title) + "' message='" + escape(err.message) + "']");
      buffer.push("##teamcity[testSuiteFinished name='" + escape(lastSuite.title) + "' duration='" + (new Date() - suites[lastSuite.title]) + "']");
      suites[lastSuite.title] = null;
      names.pop();
    }
  });

  runner.on('pending', function(test) {
    if(lastSuite != null){
      buffer.push("##teamcity[testIgnored name='" + escape(test.title) + "' message='pending']");
      buffer.push("##teamcity[testSuiteFinished name='" + escape(lastSuite.title) + "' duration='" + (new Date() - suites[lastSuite.title]) + "']")
      suites[lastSuite.title] = null;
      names.pop();
    }
  });

  runner.on('pass', function(test) {
    buffer.push("##teamcity[testFinished name='" + escape(test.title) + "' duration='" + test.duration + "']");
  
  });

  runner.on('test end', function(test) {
    buffer.push("##teamcity[testSuiteFinished name='" + escape(test.title) + "' duration='" + test.duration + "']");
  });


  runner.on('suite end', function(suite) {
    if(suite.root) return;
     buffer.push("##teamcity[testSuiteFinished name='" + escape(suite.title) + "' duration='" + (new Date() - suites[suite.title]) + "']");
     suites[lastSuite.title] = null;
     names.pop();
  });

  
  runner.on('end',function(){

    for(var i = names.length; i > -1; i--){
      var name = names[i];
      if(suites[name] != null){
        buffer.push("##teamcity[testSuiteFinished name='" + escape(name) + "' duration='" + (new Date() - suites[name]) + "']");  
      }


    }

    console.log(buffer.join('\n'));
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
