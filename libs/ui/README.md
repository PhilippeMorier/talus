# ui

- `nx test ui`
  - `--watch`
  - `--codeCoverage`

## Create new component

- `ng g module new-component --project=ui`
- `ng g component new-component --module=new-component --project=ui --style=scss`

## Storybook

The [Storybook](https://storybook.js.org/) was generated with
`nx g @nrwl/angular:storybook-configuration ui`.

- `nx run ui:storybook`
- `nx run ui:build-storybook`
- `nx run ui-e2e:e2e`
  - `--watch`
