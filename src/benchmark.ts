// https://stackoverflow.com/a/41975448/3731530
export {};

declare const require: any;

// Then we find all the tests.
const context = require.context('./', true, /\.benchmark\.ts$/);
// And load the modules.
context.keys().map(context);
