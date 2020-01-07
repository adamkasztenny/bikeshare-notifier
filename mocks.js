const module = {};
const exports = {};

const mockResponse = [
  {
    "name": "Bond St / Queen St E",
    "free": 2,
    "bikes": 4
  },
  {
    "name": "Davenport Rd / Avenue Rd",
    "free": 7,
    "bikes": 1
  },
];

function mockCallback() {
}

function mockRequest(url, json, callback) {
    callback(null, {statusCode: 200}, mockResponse);
}

function require(name) {
    return {'SES': ses, 'get': mockRequest};
}

function ses(region) {
    return {
        sendEmail: mockCallback
    }
}

const process = {
    env: {}
};
