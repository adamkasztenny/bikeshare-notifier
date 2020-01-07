describe("bikeshare-notifier", function () {
    const testEmail = "derp@example.com";

    beforeEach(function () {
        process.env.ADDRESS = testEmail;
        process.env.START_STATION = testStartStation;
        process.env.END_STATION = testEndStation;

        spyOn(ses, 'sendEmail').and.callThrough();
        spyOn(request, 'get').and.callThrough();
        spyOn(mockContext, 'succeed').and.callThrough();
        spyOn(mockContext, 'fail').and.callThrough();
    });

    it('should retreive BikeShare information', function () {
        exports.handler({}, mockContext, mockCallback);

        expect(request.get).toHaveBeenCalledTimes(1);
        expect(request.get).toHaveBeenCalledWith(apiUrl, {json: true}, jasmine.anything());
    });

    it('should mark context as a failure if the BikeShare information cannot be retreived', function () {
        request.get = function(url, json, callback) {
            callback("error", {}, {});
        };

        exports.handler({}, mockContext, mockCallback);

        expect(mockContext.succeed).toHaveBeenCalledTimes(0);
        expect(mockContext.fail).toHaveBeenCalledTimes(1);
    })

    it('should send an email with station information', function () {
        const expectedMessage = `${testStartStation} has 7 slots free and 1 bikes.\n${testEndStation} has 2 slots free and 4 bikes.`;
        const expectedParameters = {
            Destination: {
                ToAddresses: [testEmail]
            },
            Message: {
                Body: {
                    Text: { Data: expectedMessage }

                },
                Subject: { Data: "Station Summary" }
            },
            Source: testEmail
        };


        exports.handler({}, mockContext, mockCallback);

        expect(ses.sendEmail).toHaveBeenCalledTimes(1);
        expect(ses.sendEmail).toHaveBeenCalledWith(expectedParameters, jasmine.anything())
    });

    it('should mark context as a success if the email successfully sends', function () {
        exports.handler({}, mockContext, mockCallback);

        expect(mockContext.succeed).toHaveBeenCalledTimes(1);
        expect(mockContext.fail).toHaveBeenCalledTimes(0);
    });

    it('should mark context as a failure if the email does not send', function () {
        ses.sendEmail = function(parameters, callback) {
           callback("error", null);
        };

        exports.handler({}, mockContext, mockCallback);

        expect(mockContext.succeed).toHaveBeenCalledTimes(0);
        expect(mockContext.fail).toHaveBeenCalledTimes(1);
    });
});
