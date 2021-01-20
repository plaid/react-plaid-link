NODE = node --harmony
BABEL = ./node_modules/.bin/babel
MOCHA = node --harmony node_modules/.bin/mocha --reporter spec --require test/setup.js --compilers js:babel-core/register
ESLINT = node_modules/.bin/eslint
ROLLUP = node_modules/.bin/rollup
PRETTIER = node_modules/.bin/prettier
STORYBOOK_TO_PAGES = node_modules/.bin/storybook-to-ghpages
NPM_ENV_VARS = npm_config_registry=https://registry.npmjs.org
NPM = $(NPM_ENV_VARS) npm
XYZ = $(NPM_ENV_VARS) node_modules/.bin/xyz --repo git@github.com:plaid/react-plaid-link.git
STORYBOOK = node_modules/.bin/start-storybook
RELEASE_BRANCH = release

SRC_FILES  = $(shell find src -name '*.js|*.tsx|*.ts' | sort)


.PHONY: clean
clean:
	@rm -rf dist lib


.PHONY: build
build: clean
	@$(ROLLUP) -c


.PHONY: check-import
check-import:
	./scripts/check-import


.PHONY: lint
lint:
	@$(ESLINT) '{src,examples}/**/*.{ts,tsx,js,jsx}'


.PHONY: lint-fix
lint-fix:
	@$(ESLINT) --fix '{src,examples}/**/*.{ts,tsx,js,jsx}'


.PHONY: setup
setup:
	yarn


# .PHONY: test
# test:
# 	@$(MOCHA) -- test/components/PlaidLink.spec.js


.PHONY: prettier
prettier:
	@$(PRETTIER) './**/*.js' './**/*.css' --write


.PHONY: storybook
storybook:
	@$(STORYBOOK) -p 6006


.PHONY: storybook-deploy
storybook-deploy:
	$(STORYBOOK_TO_PAGES)


.PHONY: release-major release-minor release-patch
release-major release-minor release-patch: build
	@$(XYZ) --increment $(@:release-%=%) --branch $(RELEASE_BRANCH)
