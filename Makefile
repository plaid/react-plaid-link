
NODE = node --harmony
BABEL = ./node_modules/.bin/babel
MOCHA = node --harmony node_modules/.bin/mocha --reporter spec --require test/setup.js --compilers js:babel-core/register


.PHONY: build
build:
	mkdir -p dist
	$(BABEL) src/PlaidLink.js > dist/PlaidLink.js


.PHONY: setup
setup:
	npm install


.PHONY: start
start:
	$(NODE) server.js


.PHONY: test
test:
	$(MOCHA) -- test/PlaidLink.spec.js
