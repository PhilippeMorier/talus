module.exports = {
  displayName: 'kafka-proxy',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/kafka-proxy',
  globals: { 'ts-jest': { tsConfig: '<rootDir>/tsconfig.spec.json' } },
};
