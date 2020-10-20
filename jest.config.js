module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/build/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    '^.+\\.tsx?$': './test.transform.js',
  },
  moduleNameMapper: {
    '^App/(.*)$': '<rootDir>/app/$1',
    '^Contracts/(.*)$': '<rootDir>/contracts/$1',
  },
};
