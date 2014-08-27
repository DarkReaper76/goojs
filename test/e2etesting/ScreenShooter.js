var webdriver = require('selenium-webdriver');
var fs = require('fs');
var path = require('path');
var async = require('async');
var mkdirp = require('mkdirp');
var EventEmitter = require('events').EventEmitter;

module.exports = ScreenShooter;

/**
 * @class ScreenShooter
 * @param {object} [options]
 * @param {number} [options.wait]   How long to wait before taking each screenshot.
 * @param {number} [options.width]	Width of the browser window
 * @param {number} [options.height]	Height of the window
 */
function ScreenShooter(options) {
	options = options || {};

	var settings = this.settings = {
		wait   : 1200, // used to be 700 but is a tad too little for intel-nuc; will have to come up with a more robust solution if this becomes a problem
		width  : 400, // This is sort of the smallest possible in Chrome
		height : 300
	};

	for (var key in options) {
		if (typeof settings[key] !== 'undefined') {
			settings[key] = options[key];
		}
	}

	// Init driver
	this.driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();

	// Will update whenever needed.
	this.browserLog = [];
}

ScreenShooter.prototype = new EventEmitter();

// Take a screenshot on an url and store it to a file. Will emit a 'shoot' event
ScreenShooter.prototype.takeScreenshot = function (url, pngPath, callback) {
	var self = this;
	var driver = this.driver;

	// Point the browser to it
	driver.get(url).then(function () {
		setTimeout(function () {
			// Take screenshot
			driver.executeScript('return document.getElementById("goo").toDataURL();').then(function (data) {
				data = data.replace(/^data:image\/\w+;base64,/, '');

				// Create out folder if it does not exist
				mkdirp.mkdirp(path.dirname(pngPath), function (err) {
					if (err) {
						return callback(err);
					}

					// Get the console log
					var logs = new webdriver.WebDriver.Logs(driver);
					logs.get('browser').then(function (browserLog) {
						self.browserLog = browserLog;

						// Save screenshot
						fs.writeFileSync(pngPath, data, 'base64');

						self.emit('shoot', {
							url: url,
							path: pngPath,
							log: browserLog
						});

						callback();
					});
				});
			}, self.settings.wait);
		}, self.settings.wait);
	});
};

// Take many screenshots. First arg is a map from url to png path.
ScreenShooter.prototype.takeScreenshots = function (urlToPathMap, callback) {
	var self = this;

	// Get all urls
	var urls = [];
	for (var url in urlToPathMap) {
		urls.push(url);
	}

	// Loop asynchronously over all files
	async.eachSeries(urls, function (url, done) {
		// Take screenshot
		self.takeScreenshot(url, urlToPathMap[url], function () {
			done();
		});

	}, function () {
		if (callback) {
			callback();
		}
	});
};

// Shut down the shooter.
ScreenShooter.prototype.shutdown = function (callback) {
	// Shut down
	this.driver.close().then(function () {
		if (callback) {
			callback();
		}
	});
};


