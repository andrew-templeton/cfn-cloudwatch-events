

var InstallCloudWatchEvents = require('./');

var REGION = process.argv[2] || process.env.AWS_REGION || 'us-east-1';

InstallCloudWatchEvents(REGION, function(err, lambdaNames) {
	if (err) {
		console.error('Oh no! Something went wrong!');
		throw err;
	}
	console.log('Successfully deployed the Lambdas. Their ServiceTokens:');
	Object.keys(lambdaNames).forEach(function(key) {
		console.log([key, lambdaNames[key].replace('{}', REGION)].join('\n'));
	});
});
