SOURCES ?= lib/*.js lib/**/*.js lib/cli/**/*.js lib/helpers/**/*.js lib/resolvers/**/*.js
TESTS ?= test/*.test.js test/**/*.test.js test/helpers/**/*.test.js

view-cov: view-istanbul-report
lint: lint-jshint
lint-tests: lint-tests-jshint

# ==============================================================================
# Analysis
# ==============================================================================
include support/mk/notes.mk
include support/mk/jshint.mk

# ==============================================================================
# Reports
# ==============================================================================
include support/mk/coveralls.mk

# ==============================================================================
# Continuous Integration
# ==============================================================================
submit-cov-to-coveralls: submit-istanbul-lcov-to-coveralls

.PHONY: lint lint-tests submit-cov-to-coveralls
