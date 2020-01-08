describe('bikeshare-notifier', () => {
  const testEmail = 'derp@example.com'

  beforeEach(() => {
    process.env.ADDRESS = testEmail
    process.env.START_STATION = testStartStation
    process.env.END_STATION = testEndStation

    spyOn(ses, 'sendEmail').and.callThrough()
    spyOn(request, 'get').and.callThrough()
    spyOn(mockContext, 'succeed').and.callThrough()
    spyOn(mockContext, 'fail').and.callThrough()
  })

  it('should retreive BikeShare information', () => {
    exports.handler({}, mockContext, mockCallback)

    expect(request.get).toHaveBeenCalledTimes(1)
    expect(request.get).toHaveBeenCalledWith(apiUrl, { json: true }, jasmine.anything())
  })

  it('should mark context as a failure if the BikeShare information cannot be retreived', () => {
    request.get = (url, json, callback) => {
      callback('error', {}, {})
    }

    exports.handler(mockEvent, mockContext, mockCallback)

    expect(mockContext.succeed).toHaveBeenCalledTimes(0)
    expect(mockContext.fail).toHaveBeenCalledTimes(1)
    expect(mockContext.fail).toHaveBeenCalledWith(mockError)
  })

  it('should send an email with station information', () => {
    const expectedMessage = `${testStartStation} has 7 slots free and 1 bikes.\n${testEndStation} has 2 slots free and 4 bikes.`
    const expectedParameters = {
      Destination: {
        ToAddresses: [testEmail]
      },
      Message: {
        Body: {
          Text: { Data: expectedMessage }

        },
        Subject: { Data: 'Station Summary' }
      },
      Source: testEmail
    }

    exports.handler(mockEvent, mockContext, mockCallback)

    expect(ses.sendEmail).toHaveBeenCalledTimes(1)
    expect(ses.sendEmail).toHaveBeenCalledWith(expectedParameters, jasmine.anything())
  })

  it('should mark context as a success if the email successfully sends', () => {
    exports.handler(mockEvent, mockContext, mockCallback)

    expect(mockContext.succeed).toHaveBeenCalledTimes(1)
    expect(mockContext.succeed).toHaveBeenCalledWith(mockEvent)
    expect(mockContext.fail).toHaveBeenCalledTimes(0)
  })

  it('should mark context as a failure if the email does not send', () => {
    ses.sendEmail = (parameters, callback) => {
      callback(mockError, null)
    }

    exports.handler(mockEvent, mockContext, mockCallback)

    expect(mockContext.succeed).toHaveBeenCalledTimes(0)
    expect(mockContext.fail).toHaveBeenCalledTimes(1)
    expect(mockContext.fail).toHaveBeenCalledWith(mockError)
  })
})
