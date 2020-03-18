NODE = node --harmony
BABEL = ./node_modules/.bin/babel
MOCHA = node --harmony node_modules/.bin/mocha --reporter spec --require test/setup.js --compilers js:babel-core/register
ESLINT = node_modules/.bin/eslint
ROLLUP = node_modules/.bin/rollup
NPM_ENV_VARS = npm_config_registry=https://registry.npmjs.org
NPM = $(NPM_ENV_VARS) npm
XYZ = $(NPM_ENV_VARS) node_modules/.bin/xyz --repo git@github.com:plaid/react-plaid-link.git
STORYBOOK = node_modules/.bin/start-storybook

SRC_FILES  = $(shell find src -name '*.js|*.tsx|*.ts' | sort)


.PHONY: compile
compile:
	@echo "[Compiling source]"
	$(BABEL) src --out-dir lib


.PHONY: build
build:
	@$(ROLLUP) -c


.PHONY: check-import
check-import:
	./scripts/check-import

.PHONY: clean
clean:
	@rm -rf dist lib


.PHONY: lint
lint:
	@$(ESLINT) '{src,examples}/**/*.{ts,tsx,js,jsx}'


.PHONY: lint-fix
lint-fix:
	@$(ESLINT) --fix -- $(SRC_FILES)

.PHONY: setup
setup:
	@$(NPM) install


.PHONY: start
start:
	@$(NODE) server.js

#
# .PHONY: test
# test:
# 	@$(MOCHA) -- test/components/PlaidLink.spec.js


.PHONY: prettier
prettier:
	prettier './**/*.js' './**/*.css' --write


.PHONY: storybook
storybook:
	@$(STORYBOOK) -p 6006


.PHONY: release-major release-minor release-patch
release-major release-minor release-patch: compile build
	@$(XYZ) --increment $(@:release-%=%)
