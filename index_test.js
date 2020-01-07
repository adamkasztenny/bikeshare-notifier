describe("bikeshare-notifier", function () {

    it('should send a test email', function () {
        spyOn(ses, 'sendEmail');

        const testEmail = "derp@example.com"
        process.env.ADDRESS = testEmail

        const expectedParameters = {
            Destination: {
                ToAddresses: [testEmail]
            },
            Message: {
                Body: {
                    Text: { Data: "Test" }
                    
                },
                Subject: { Data: "Test Email" }
            },
            Source: testEmail 
        };


        exports.handler({}, {}, mockCallback)

        expect(ses.sendEmail).toHaveBeenCalledTimes(1);
        expect(ses.sendEmail).toHaveBeenCalledWith(expectedParameters, jasmine.anything())
    })
})
