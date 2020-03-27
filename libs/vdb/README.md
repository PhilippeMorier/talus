# vdb-js

JavaScript implementation of [OpenVDB](https://www.openvdb.org/).

## Usage

### JavaScript

```javascript
let vdb = require('vdb-js');

let grid = new vdb.Grid(-1);
let accessor = grid.getAccessor();

accessor.setValueOn([0, 0, 0], 42);
accessor.getValue([0, 0, 0]); // 42
```

### TypeScript

```typescript
import { Grid } from 'vdb-js';

const grid = new Grid(-1);
const accessor = grid.getAccessor();

accessor.setValueOn([0, 0, 0], 42);
accessor.getValue([0, 0, 0]); // 42
```

## Publish

1. `npm login`
2. `yarn nx build vdb`
3. `cd ./dist/libs/vdb`
4. `npm publish`
