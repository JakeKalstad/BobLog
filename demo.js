var bobLog = require('./');

function testError() {
	bobLog.error("Uh oh, an error occurred..");
}

function testDebug() {
	bobLog.debug("Whats going on here...");
}

console.log('Beginning test');
testError();
testDebug();