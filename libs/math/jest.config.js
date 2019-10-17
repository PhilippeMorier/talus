module.exports = {
  name: 'math',
  preset: '../../jest.config.js',
  testMatch: ['**/+(*.)+(benchmark).+(ts|js)?(x)'],
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../coverage/libs/math',
};
