
var path = require('path');
var DeployRuleResourceLambdas = require(deploymentModulePath('rule'));
var DeployTargetResourceLambdas = require(deploymentModulePath('target'));


module.exports = DeployCloudWatchEventsResources;


function DeployCloudWatchEventsResources(region, callback){
	DeployTargetResourceLambdas(null, region, [region], function(targetArnPattern) {
		console.log('Completed deployment of the Target CloudFormation Custom Resource service!');
		DeployRuleResourceLambdas(null, region, [region], function(ruleArnPattern) {
			console.log('Completed the deployment of the Rule CloudFormation Custom Resource service!');
			console.log('Completed both of CloudWatch Events CloudFormation Custom Resource services!');
			callback(null, {
				'CloudwatchEventsRule': getLambdaName(ruleArnPattern),
				'CloudwatchEventsTarget': getLambdaName(targetArnPattern)
			});
		});
	});
};

function getLambdaName(arn) {
	return arn.match(/[^:]+$/g)[0];
}

function deploymentModulePath(type) {
	return path.join(__dirname, 'node_modules',
		'cfn-cloudwatch-events-' + type, 'node_modules',
		'cfn-lambda', 'deploy');
}