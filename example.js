

var fs = require('fs');
var path = require('path');

var AWS = require('aws-sdk');
var CloudFormation = new AWS.CloudFormation({apiVersion: '2010-05-15'});

// Using this module, though you would use:
// require('cfn-cloudwatch-events');
var InstallCloudWatchEvents = require('./');


var REGION = process.env.AWS_REGION || 'us-east-1';
var SCHEDULE_EXPRESSION = process.argv[2] || 'rate(5 minutes)';


console.log('About to deploy CloudWatch Events CloudFormation Custom' +
	' Resource Lambdas then deploy a stack using them...');
console.log('Using region: ' + REGION);

console.log('Running install of CloudWatch Events Custom Recourse Lambdas...');
InstallCloudWatchEvents(REGION, function(err, lambdaNames) {
	var StackName = [
		'CloudWatchEvents',
		'Stack',
		Date.now()
	].join('-');
	if (err) {
		console.error('Failure when deploying the custom resource Lambdas: ', err);
		throw err;
	}
	console.log('Deployed some custom lambdas to ' + REGION + ', thsese are the Function Names: ', lambdaNames);
	console.log('About to launch a stack that has these Resources...');
	console.log('Using this StackName: ' + StackName);
	CloudFormation.createStack({
		Capabilities: [
			'CAPABILITY_IAM'
		],
		StackName: StackName,
		Parameters: [
			{
				ParameterKey: 'CloudWatchEventsRuleCustomResourceLambdaName',
				ParameterValue: lambdaNames.CloudwatchEventsRule
			},
			{
				ParameterKey: 'CloudWatchEventsTargetCustomResourceLambdaName',
				ParameterValue: lambdaNames.CloudwatchEventsTarget
			},
			{
				ParameterKey: 'CloudWatchEventsRuleName',
				ParameterValue: StackName + '-cron'
			},
			{
				ParameterKey: 'CloudWatchEventsRuleScheduleExpression',
				ParameterValue: SCHEDULE_EXPRESSION
			},
			{
				ParameterKey: 'CloudWatchEventsRuleState',
				ParameterValue: 'ENABLED'
			},
			{
				ParameterKey: 'EventTargetStaticInputValue',
				ParameterValue: 'foobarbazqux'
			}
		],
		TemplateBody: fs.readFileSync(path.join('.', 'example.json')).toString()
	}, function(err, data) {
		if (err) {
			console.error('Something went wrong on create: ', err);
			throw err;
		}
		console.log('Done initiating deploy! Go watch in the Console:');
		console.log('https://console.aws.amazon.com/cloudformation/home?region=' +
			REGION + '#/stack/detail?stackId=' + data.StackId);
	});
});






