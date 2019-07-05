# Talus

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
