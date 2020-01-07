var aws = require('aws-sdk');
var ses = new aws.SES({region: 'us-east-1'});

exports.handler = (event, context, callback) => {
    const parameters = createParameters();
    sendEmail(parameters, event, context, callback)
};

function createParameters() {
     return {
        Destination: {
            ToAddresses: [getAddress()]
        },
        Message: {
            Body: {
                Text: { Data: "Test" }
            },
            Subject: { Data: "Test Email" }
        },
        Source: getAddress()
    };
}

function sendEmail(parameters, event, context, callback) {
     ses.sendEmail(parameters, function (err, data) {
        callback(null, {err: err, data: data});
        if (err) {
            console.log(err);
            context.fail(err);
        } else {
            console.log(data);
            context.succeed(event);
        }
    });
}

function getAddress() {
    return process.env.ADDRESS
}
