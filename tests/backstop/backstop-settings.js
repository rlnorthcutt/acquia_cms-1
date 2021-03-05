/*
  How to use

  backstop reference --configPath=backstop-settings.js
       backstop test --configPath=backstop-settings.js

  backstop reference --configPath=backstop-settings.js --refhost=http://example.com
       backstop test --configPath=backstop-settings.js --testhost=http://example.com

  backstop reference --configPath=backstop-settings.js --paths=/,/contact
       backstop test --configPath=backstop-settings.js --paths=/,/contact

  backstop reference --configPath=backstop-settings.js --pathfile=paths
       backstop test --configPath=backstop-settings.js --pathfile=paths

 */

/*
  Set up some variables
 */
var arguments = require('minimist')(process.argv.slice(2)); // grabs the process arguments
var defaultPaths = ['/']; // By default is just checks the homepage
var scenarios = []; // The array that'll have the pages to test

/*
  Work out the environments that are being compared
 */
// The host to test
if (!arguments.testhost) {
  arguments.testhost  = "http://127.0.0.1:8000"; // Default test host
}
// The host to reference
if (!arguments.refhost) {
  arguments.refhost  = "http://127.0.0.1:8000"; // Default test host
}
/*
  Work out which paths to use, either a supplied array, an array from a file, or the defaults
 */
if (arguments.paths) {
  pathString = arguments.paths;
  var paths = pathString.split(',');
} else if (arguments.pathfile) {
  var pathConfig = require('./' + arguments.pathfile+'.js');
  var paths = pathConfig.array;
} else {
  var paths = defaultPaths; // keep with the default of just the homepage
}

// get the labels dynamically from labels file.
if (arguments.labelfile) {
  var labelsConfig = require('./' + arguments.labelfile+'.js');
  var labels = labelsConfig.array;
}

// Configuration
module.exports =
  {
    "id": "backstop_default",
    "viewports": [
      {
        "label": "mobile",
        "width": 320,
        "height": 2000
      },
      {
        "label": "tablet",
        "width": 768,
        "height": 2000
      },
      {
        "label": "desktop",
        "width": 1170,
        "height": 2000
      }
    ],
    "scenarios":
    scenarios
    ,
    "onBeforeScript": "puppet/onBefore.js",
    "onReadyScript": "puppet/onReady.js",
    "paths": {
      "bitmaps_reference": "tests/backstop/bitmaps_reference",
      "bitmaps_test": "tests/backstop/bitmaps_test",
      "engine_scripts": "tests/backstop/engine_scripts",
      "html_report": "tests/backstop/html_report",
      "ci_report": "tests/backstop/ci_report"
    },
    "casperFlags": [],
    "report": ["browser"],

    "engine": "puppeteer",
    "engineOptions": {
      "args": ["--no-sandbox"]
    },
    "asyncCaptureLimit": 5,
    "asyncCompareLimit": 50,
    "debug": false,
    "debugWindow": false
  };
for (var k = 0; k < paths.length; k++) {
  scenarios.push({
    "label": labels[k],
    "cookiePath": "backstop_data/engine_scripts/cookies.json",
    "url": arguments.testhost+paths[k],
    "referenceUrl": "",
    "readyEvent": "",
    "readySelector": "",
    "delay": 0,
    "hideSelectors": [],
    "removeSelectors": [],
    "hoverSelector": "",
    "clickSelector": "",
    "postInteractionWait": 0,
    "selectors": [ 'document' ],
    "selectorExpansion": true,
    "expect": 0,
    "misMatchThreshold": 10.0,
    "requireSameDimensions": true,
    "sIndex": 8
  });
}
