SOURCES ?= lib/*.js lib/**/*.js lib/cli/**/*.js lib/helpers/**/*.js lib/resolvers/**/*.js
TESTS ?= test/*.test.js test/**/*.test.js test/helpers/**/*.test.js

# ==============================================================================
# Analysis
# ==============================================================================
include support/mk/notes.mk

# ==============================================================================
# Reports
# ==============================================================================
include support/mk/coveralls.mk

# ==============================================================================
# Continuous Integration
# ==============================================================================
submit-cov-to-coveralls: submit-istanbul-lcov-to-coveralls

.PHONY: submit-cov-to-coveralls
