# Talus [![CircleCI](https://circleci.com/gh/PhilippeMorier/talus/tree/master.svg?style=svg)](https://circleci.com/gh/PhilippeMorier/talus/tree/master)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.1 by running `ng new talus --prefix tls --style scss --skip-git --routing true --skip-install` as command.

## Installations

### Node

1. Install `nvm`
   - https://github.com/nvm-sh/nvm#installation-and-update
2. Install (latest) `node`
   - `nvm install node`
   - or add a version `nvm install 12.3.1`

### Yarn

1. Install `yarn`
   - `brew install yarn`
2. Update
   - `brew upgrade yarn`

### CircleCI CLI

1. Install CLI
   - `curl -fLSs https://circle.ci/cli | bash`
2. Check syntac of `config.yml`
   - `circleci config process .circleci/config.yml`
3. Run single job
   - `circleci local execute --job 'dependencies'`

## Development server

Run `yarn start editor` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `yarn build editor` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `yarn test editor` to execute the unit tests via [Karma](https://karma-runner.github.io). Pass `--code-coverage` to generate the coverage-rapport.

## Running benchmarks

`yarn benchmark editor`

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
