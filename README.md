# Talus [![CircleCI](https://circleci.com/gh/PhilippeMorier/talus/tree/convert-to-nx.svg?style=svg)](https://circleci.com/gh/PhilippeMorier/talus/tree/convert-to-nx)

This project was generated using [Nx](https://nx.dev) with the following command sequence.

1. `yarn global add create-nx-workspace`

2. `yarn create nx-workspace talus --npmScope=talus --style=scss --preset=empty`

3. Add to top level `schematics` in `angular.json`

   ```json
    "schematics": {
      "@nrwl/schematics:application": {
        "style": "scss",
        "unitTestRunner": "jest",
        "e2eTestRunner": "cypress"
      },
      "@nrwl/schematics:library": {
        "style": "scss",
        "unitTestRunner": "jest"
      },
      "@nrwl/angular:ng-add": {
        "unitTestRunner": "jest",
        "e2eTestRunner": "cypress"
      },
      "@nrwl/angular:application": {
        "unitTestRunner": "jest",
        "e2eTestRunner": "cypress"
      },
      "@nrwl/angular:component": {
        "styleext": "scss",
        "inlineTemplate": true
      }
    }
   ```

4. https://nx.dev/api/angular/schematics/ng-add  
   `ng add @nrwl/angular` & `npm audit fix`

5. `ng generate @nrwl/angular:application frontend --directory --style=scss --inlineTemplate --viewEncapsulation=Emulated --prefix=fe --tags=frontend`

6. `ng generate @nrwl/angular:lib ui --directory --style=scss --prefix=ui --tags=ui`

7. `ng generate @nrwl/angular:module sidenav-shell --project=ui`

8. `ng generate @nrwl/angular:component sidenav-shell --project=ui --module=sidenav-shell --export`

## Installations

### Node

1. Install `nvm`
   - https://github.com/nvm-sh/nvm#installation-and-update
2. Install (latest) `node`
   - `nvm install node`
   - or add a version `nvm install 12.3.1`
   - set a version as default `nvm alias default 12.3.1`

### Yarn

1. Install `yarn`
   - `brew install yarn`
2. Update
   - `brew upgrade yarn`

### CircleCI CLI

1. Install CLI
   - `curl -fLSs https://circle.ci/cli | bash`
2. Check syntax of `config.yml`
   - `circleci config process .circleci/config.yml`
3. Run single job
   - `circleci local execute --job 'dependencies'`

## Build

- `yarn build frontend` (saved in `./dist`)
- `yarn nx run frontend:build:production` (see [ng run](https://angular.io/cli/run))

## Test

### Unit

- All: `yarn test` (`--watch` or `--watchAll`)
- Project 'frontend': `yarn test frontend`
- Coverage: `yarn test --code-coverage` (saved in `./coverage`)

### E2E

- `yarn e2e <frontend-e2e>`

## Nx

### Update
- Just run `nx migrate @nrwl/workspace` (see [nx.dev-guide](https://nx.dev/angular/guides/update))

### Commands

See scripts on [nx.dev](https://nx.dev/angular/api/workspace/npmscripts)

- `yarn nx --help`

## Github Pages

CircleCI pushes every build onto the [gh-pages branch](https://github.com/PhilippeMorier/talus/tree/gh-pages) which gets published by github under:

- Schema: `https://philippemorier.github.io/talus/<branch>/<build-num>/dist/apps/frontend/`
- Example: https://philippemorier.github.io/talus/convert-to-nx/245/dist/apps/frontend/
