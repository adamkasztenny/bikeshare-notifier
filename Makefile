NAME=bikeshare-notifier
ZIP=${NAME}.zip

clean:
	rm -f ${ZIP}

build:
	npm install
	zip -r ${ZIP} . -x *.git*
	zipinfo ${ZIP}

deploy: build
	aws lambda update-function-code --function-name ${NAME} --zip-file fileb://${ZIP}

run:
	aws lambda invoke --function-name ${NAME} ${NAME}.log

test:
	npm install -D
	npm test
