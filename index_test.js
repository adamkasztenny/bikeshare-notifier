describe("bikeshare-notifier", function () {
    const testEmail = "derp@example.com";

    beforeEach(function () {
        process.env.ADDRESS = testEmail;
        process.env.START_STATION = "Davenport Rd / Avenue Rd";
        process.env.END_STATION = "Bond St / Queen St E";
        spyOn(ses, 'sendEmail').and.callThrough();
        spyOn(request, 'get').and.callThrough();
    });

    it('should retreive BikeShare information', function () {
        exports.handler({}, {}, mockCallback)

        expect(request.get).toHaveBeenCalledTimes(1);
        expect(request.get).toHaveBeenCalledWith(apiUrl, {json: true}, jasmine.anything());
    });

    it('should send an email with station information', function () {
        const expectedMessage = "Davenport Rd / Avenue Rd has 7 slots free and 1 bikes.\nBond St / Queen St E has 2 slots free and 4 bikes.";
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


        exports.handler({}, {}, mockCallback)

        expect(ses.sendEmail).toHaveBeenCalledTimes(1);
        expect(ses.sendEmail).toHaveBeenCalledWith(expectedParameters, jasmine.anything())
    });
})
