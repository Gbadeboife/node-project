module.exports = {
    // Automatically clear mock calls and instances between every test
    clearMocks: true,
    
    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: true,
    
    // The directory where Jest should output its coverage files
    coverageDirectory: "coverage",
    
    // The test environment that will be used for testing
    testEnvironment: "node",
    
    // The glob patterns Jest uses to detect test files
    testMatch: [
        "**/tests/**/*.test.js"
    ],
    
    // An array of regexp pattern strings that are matched against all test paths
    testPathIgnorePatterns: [
        "/node_modules/"
    ],
    
    // A map from regular expressions to paths to transformers
    transform: {}
};
