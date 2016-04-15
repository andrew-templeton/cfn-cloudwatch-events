
## CloudFormation Custom Resources for CloudWatch Events

Read the documentation on how to use individual custom resources here: 
- [CloudWatch Events Rule](https://www.npmjs.com/package/cfn-cloudwatch-events-rule)
- [CloudWatch Events Target](https://www.npmjs.com/package/cfn-cloudwatch-events-target)


The deployment of both of these into the current region is exposed as a function: 

```
var AddCloudWatchEventsToCfn = require('cfn-cloudwatch-events');

AddCloudWatchEventsToCfn('us-east-1', function(err, functionNames) {
	console.log(functionNames);
	/*
		Keys on the object:
			CloudwatchEventsRule
			CloudwatchEventsTarget
		These are the Function Names of the Lambda used for ServiceToken in this region.
	*/
});
```


If you want to see an example, look in:
- `example.js` -> An example function using the deployment module and launching a simple stack with a scheduled Lambda execution using the Rule and Target portions of CloudWatch Events.
- `example.json` -> An example template using the Rule and Target CloudWatch Events CloudFormation Custom Resources.

You'll want to run something like this to run the `example.js` properly: 

```
$ export AWS_PROFILE=your_profile
$ export AWS_REGION=your_region
# The default is 5 minutes anyways
# This is the cron or rate expression for Lambda call schedule.
$ node deploy.js 'rate(5 minutes)'
```