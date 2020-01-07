# bikeshare-notifier
AWS Lambda that sends emails to notify about Toronto BikeShare station availability

Deploying:
1. Create an IAM user with the `lambda:UpdateFunctionCode` permission.
2. Run `aws configure` and enter that user's info.
3. Run:
    ```
        make clean
        make deploy
    ```
4. Make sure the following environment variables are set in the lambda config:
  a. ADDRESS, the email address to send to and from
  b. START_STATION, the Toronto BikeShare station you travel to in the morning, e.g. "Queen St. E / Eastern Ave"
  c. END_STATION, the Toronto BikeShare station you return to in the evening
5. Create a CloudWatch cron trigger, e.g. `0 14,10 ? * MON-FRI *`

Running:
1. Make sure the IAM user has the `lambda:Invoke` permission.
2. Run `make run`.

Testing:
1. Run `make test`.
2. Open a browser and navigate to [`localhost:9876`](localhost:9876).
