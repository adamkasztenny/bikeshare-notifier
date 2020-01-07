ZIP=bikeshare-notifier.zip

clean:
	rm -f ${ZIP}

build:
	npm install
	zip -r ${ZIP} . -x *.git*
	zipinfo ${ZIP}

deploy: build
	aws lambda update-function-code --function-name bikeshare-notifier --zip-file fileb://${ZIP}

test:
	npm install -D
	npm test
