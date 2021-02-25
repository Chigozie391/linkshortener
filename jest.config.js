module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['dotenv/config'],
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/']
};
