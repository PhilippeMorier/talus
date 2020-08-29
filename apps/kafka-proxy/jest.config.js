module.exports = {
  name: 'kafka-proxy',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/kafka-proxy',
  globals: { 'ts-jest': { tsConfig: '<rootDir>/tsconfig.spec.json' } },
};
