ZIP=bikeshare-notifier.zip

clean:
	rm -f ${ZIP}

build:
	npm install
	zip -r ${ZIP} . -x *.git*
	zipinfo ${ZIP}

test:
	npm install -D
	npm test
