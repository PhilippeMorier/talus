# Talus [![CircleCI](https://circleci.com/gh/PhilippeMorier/talus/tree/master.svg?style=svg)](https://circleci.com/gh/PhilippeMorier/talus/tree/master)

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

5. `ng generate @nrwl/angular:application frontend --style=scss --inlineTemplate --viewEncapsulation=Emulated --prefix=fe --tags=frontend`

6. `ng generate @nrwl/angular:lib ui --style=scss --prefix=ui --tags=ui`

7. `ng generate @nrwl/angular:module sidenav-shell --project=ui`

8. `ng generate @nrwl/angular:component sidenav-shell --project=ui --module=sidenav-shell --export`

9. `nx generate @nrwl/node:application benchmark --linter=eslint`

10. `ng generate @nrwl/workspace:library model --linter=eslint`

11. `nx generate @nrwl/angular:storybook-configuration ui`

12. `ng generate @nrwl/workspace:library shared --linter=eslint`

13. `ng generate @nrwl/node:library vdb --linter=eslint --publishable`

12. `ng generate @nrwl/workspace:library shared --linter=eslint`

## Installations

### Node

1. Install `nvm`
   - https://github.com/nvm-sh/nvm#installation-and-update
2. Install (latest) `node`
   - `nvm install node`
   - or add a version `nvm install 13.4.0`
   - set a version as default `nvm alias default 13.4.0`

### Yarn

#### Manually

1. Install `yarn`
   - https://yarnpkg.com/lang/en/docs/install/#debian-stable

#### With brew

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

#### Debug via `ssh`

CircleCI allows to connect to a job via `ssh`. In order to be able to connect via `ssh` a failed job
needs to be rerun via the option 'Rerun job with SSH' in the CircleCI-UI in the top right corner.

If the public key of your GitHub account is on your system you should be able to connect to the
running job via e.g. `ssh -p 64537 3.89.247.61`.

### WebStorm

#### Plugin: Awesome Console

Install [this plugin](https://plugins.jetbrains.com/plugin/7677-awesome-console) to be able to click
on a file path within the console.

#### Macro

Setting up a macro which will fix all the linting issues, optimizes the imports and runs Prettier.

1. StyleLint

   - Setup a file watcher ([fix action](https://youtrack.jetbrains.com/issue/WEB-25069) not yet
     supported) with
     - File Type: `SCSS style sheet`
     - Scope: `Current File`
     - Program: `$ProjectFileDir$/node_modules/.bin/stylelint`
     - Arguments: `$FileName$ --fix`
     - Working Dir: `$FileDir$`
     - Advanced Options: None, all deactivated

2. Record macro (Edit > Macros > Start Macro Recording) in this order

   - Action: `OptimizeImports`
   - Action: `TsLintFileFixAction` (with opened \*.ts file)
   - Action: `Javascript.Linters.EsLint.Fix`
   - Action: `ReformatWithPrettierAction`
   - Action: `FileWatcher.runForFiles` (with opened \*.scss file)
   - Action: `SaveAll`

3. Save macro as e.g. `Fix & Save`  
   (macros are saved under `/home/<user>/.WebStorm2019.3/config/options/macros.xml`)

4. Assign Keyboard shortcut `Ctrl` + `S` to macro `Fix & Save` (search for macro)

### Git

1. Make sure that `git-completion` is working, otherwise run:
   `sudo apt-get install git-core bash-completion`

2. Add branch name to shell
   - Download & save
     [git-prompt.sh](https://github.com/git/git/blob/master/contrib/completion/git-prompt.sh)
   - Add in `.bashrc`:
     ```
     # GIT prompt
     . ~/Projects/git-prompt.sh
     export GIT_PS1_SHOWDIRTYSTATE=1
     export PS1='\[\e[1;32m\]\u\[\e[m\]@\[\e[33m\]\h\[\e[m\]:\[\e[34m\]\w\[\e[m\]$(__git_ps1 " (%s)")\$ '
     ```

## Build

- `yarn build frontend` (saved in `./dist`)
- `yarn nx run frontend:build:production` (see [ng run](https://angular.io/cli/run))

## Test

### Unit

- All: `yarn test` (`--watch` or `--watchAll`)
- Project 'frontend': `yarn test frontend`
- Coverage: `yarn test:code-coverage` (saved in `./coverage`)

### E2E

- Ensure that all
  [dependencies](https://docs.cypress.io/guides/guides/continuous-integration.html#Dependencies) are
  installed in order to be able to run Cypress locally.
- `yarn nx e2e frontend-e2e`

When updating Cypress version in `package.json` the version in `.circleci/config.yml` needs to be
updated as well.

## Nx

### Update

- Just run `nx migrate @nrwl/workspace` (see [nx.dev-guide](https://nx.dev/angular/guides/update))

### Commands

See scripts on [nx.dev](https://nx.dev/angular/api/workspace/npmscripts)

- `yarn nx --help`

- `yarn run affected:dep-graph`

## Ng

### Update

- ng update @angular/cli @angular/core @angular/cdk @angular/material
- [Angular Update Guide](https://update.angular.io/)

### Generate transpiled code with AOT-compiler `ngc`

- `ngc -p ./apps/frontend/tsconfig.app.json` (output: `./dist/out-tsc`)

## Backend

### NestJS

- `yarn add --dev @nrwl/nest`
- `nx g @nrwl/nest:application kafka-proxy --frontend-project frontend --linter eslint`

### Docker

### Docker Engine - Community

https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-using-the-repository

- `sudo apt-get update`
- `sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common`
- `curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -`
- `sudo apt-key fingerprint 0EBFCD88`
- `sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) eoan test"`
  (https://unix.stackexchange.com/a/363058)
- `sudo apt-get update`

### Docker Compose binary

https://docs.docker.com/compose/install/

- `sudo curl -L "https://github.com/docker/compose/releases/download/1.25.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose`
- `sudo chmod +x /usr/local/bin/docker-compose`

### Docker Command-line completion

https://docs.docker.com/compose/completion/

- `sudo curl -L https://raw.githubusercontent.com/docker/compose/1.25.3/contrib/completion/bash/docker-compose -o /etc/bash_completion.d/docker-compose`

## Github Pages

CircleCI pushes every develop/master branch build (frontend & storybook of ui) onto the
[gh-pages branch](https://github.com/PhilippeMorier/talus/tree/gh-pages) which gets published on
GitHub under:

Example:

- frontend: `https://philippemorier.github.io/talus/master/d632e97/apps/frontend/`
- storybook of ui: `https://philippemorier.github.io/talus/master/d632e97/storybook/ui/`

See also the [releases page](https://github.com/PhilippeMorier/talus/releases) for older versions.
