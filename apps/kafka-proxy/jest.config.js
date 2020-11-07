module.exports = {
  displayName: 'kafka-proxy',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/kafka-proxy',
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
};
