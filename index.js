var aws = require('aws-sdk');
var ses = new aws.SES({region: 'us-east-1'});
var request = require('request');

const apiUrl = 'http://api.citybik.es/bixi-toronto.json';

exports.handler = (event, context, callback) => {
    console.log("Starting bikeshare-notifier");

	return request.get(apiUrl, { json: true }, (error, response, stations) => {
        console.log("Got response, status is: " + response.statusCode);

		if (error) {
		  console.log(error);
          return context.fail(error);
        }

        const message = createMessage(stations)
        const parameters = createParameters(message);
        return notify(parameters, event, context, callback)
	});
}

function createMessage(stations) {
    const startStation = stations.filter(station => station.name == getStartStation())[0] || {};
    const endStation = stations.filter(station => station.name == getEndStation())[0] || {};
    return createStationMessage(startStation) + "\n" + createStationMessage(endStation);
}

function createStationMessage(station) {
    return `${station.name} has ${station.free} slots free and ${station.bikes} bikes.`;
}

function createParameters(message) {
     return {
        Destination: {
            ToAddresses: [getAddress()]
        },
        Message: {
            Body: {
                Text: { Data: message }
            },
            Subject: { Data: "Station Summary" }
        },
        Source: getAddress()
    };
}

function notify(parameters, event, context, callback) {
     console.log("Sending email");

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

function getStartStation() {
    return process.env.START_STATION;
}

function getEndStation() {
    return process.env.END_STATION;
}

function getAddress() {
    return process.env.ADDRESS
}
