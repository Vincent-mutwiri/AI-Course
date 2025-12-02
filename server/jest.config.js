module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.test.ts'],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/scripts/**',
        '!src/seed/**',
        '!src/index.ts'
    ],
    moduleFileExtensions: ['ts', 'js', 'json'],
    transform: {
        '^.+\\.ts$': ['ts-jest', { isolatedModules: true }]
    },
    setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
    testTimeout: 30000
};
