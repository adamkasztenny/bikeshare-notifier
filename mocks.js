const module = {};
const exports = {};

function mockCallback() {
}

const mockContext = {
    succeed: mockCallback,
    fail: mockCallback,
}

const testStartStation = "Davenport Rd / Avenue Rd";
const testEndStation = "Bond St / Queen St E";

const mockResponse = [
  {
    "name": testStartStation,
    "free": 7,
    "bikes": 1
  },
  {
    "name": testEndStation,
    "free": 2,
    "bikes": 4
  },
];

function mockRequest(url, json, callback) {
    callback(null, {statusCode: 200}, mockResponse);
}

function require(name) {
    return {'SES': ses, 'get': mockRequest};
}

function ses(region) {
    return {
        sendEmail: function(parameters, callback) {
           callback(null, {});
        }
    }
}

const process = {
    env: {}
};
