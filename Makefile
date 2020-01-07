NAME=bikeshare-notifier
LOG=${NAME}.log
ZIP=${NAME}.zip

clean:
	rm -f ${ZIP} ${LOG}

build:
	npm install
	zip -r ${ZIP} . -x *.git*
	zipinfo ${ZIP}

deploy: build
	aws lambda update-function-code --function-name ${NAME} --zip-file fileb://${ZIP}

run:
	aws lambda invoke --function-name ${NAME} ${LOG}

test:
	npm install -D
	npm test
