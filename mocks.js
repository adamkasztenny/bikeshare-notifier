const module = {};
const exports = {};

function mockCallback() {
}

function require(name) {
    return {'SES': ses}
}

function ses(region) {
    return {
        sendEmail: mockCallback
    }
}

const process = {
    env: {}
};
