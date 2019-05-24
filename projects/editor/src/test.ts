// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import 'zone.js/dist/zone-testing';

// ERROR in node_modules/@babylonjs/core/Engines/engine.d.ts(8,10):
// error TS2305: Module '"./engine"' has no exported member 'IDisplayChangedEventArgs'.
import '@babylonjs/core/Engines/Extensions/engine.webVR';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
