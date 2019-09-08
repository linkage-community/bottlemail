module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	collectCoverageFrom: [
		"src/**/*.ts",
		// not required for tests
		"!src/**/*.test.ts",
		// only aliases
		"!src/**/index.ts",
	]
}
