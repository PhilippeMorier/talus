# vdb-js

JavaScript implementation of [OpenVDB](https://www.openvdb.org/).

The idea is to keep the code as close as possible to the
[original source](https://github.com/AcademySoftwareFoundation/openvdb).

## Usage

### JavaScript

#### Set/get voxel (with cached access)

```javascript
let vdb = require('vdb-js');

let grid = new vdb.Grid(-1);
let accessor = grid.getAccessor();

accessor.setValueOn([0, 0, 0], 42);
accessor.getValue([0, 0, 0]); // 42
```

### Iterate over active voxels

```javascript
accessor.setValueOn([2, 1, 0], 42);
accessor.setValueOn([845, 64, 242], 42);
accessor.setValueOn([1000, 200000, 4000], 42);

let counter = 0;
for (const voxel of grid.beginVoxelOn()) {
  counter++;
  console.log(voxel.value); // 42
}

console.log(counter); // 3
```

### Ray intersection

```javascript
let eye = new vdb.Vec3(0, -1, 0);
let direction = new vdb.Vec3(0, 1, 0);
let ray = new vdb.Ray(eye, direction);

let intersector = new vdb.VolumeRayIntersector(grid);

if (intersector.setIndexRay(ray)) {
  console.log('Ray intersects!');
}

let start = [0, -10, 0];
let end = [0, 10, 0];
let timeSpanRef = new vdb.TimeSpan(start, end);

intersector.marchUntilEnd(timeSpanRef);

console.log('first hit of active tile/leaf:', timeSpanRef.t0);
console.log('first hit of inactive tile or exit point of BBOX for leaf nodes:', timeSpanRef.t1);
```

### TypeScript

```typescript
import { Grid } from 'vdb-js';

const grid = new Grid(-1);
const accessor = grid.getAccessor();

accessor.setValueOn([0, 0, 0], 42);
accessor.getValue([0, 0, 0]); // 42
```

## Limitations

Currently, only the following hard-coded tree structure/hierarchy is supported:

- `InternalNode2.DIM` = 256
- `InternalNode1.DIM` = 64
- `LeafNode.DIM` = 8

```
                        ─ ─┌┬┬┬──────────┬┬┬┐─ ─
                           |||| RootNode ||||
                        ─ ─└┴┴┴─────┬────┴┴┴┘─ ─
                          ┌─────────┴─────────┐
                          ▼                   ▼
                  ┌───────────────┐   ┌───────────────┐   ┌─ ─ ─
                  | InternalNode2 |   | InternalNode2 |   |
                  └───────┬───────┘   └───────┬───────┘   └─ ─ ─
                ┌─────────┴─────────┐         └─────────┐
                ▼                   ▼                   ▼
        ┌───────────────┐   ┌───────────────┐   ┌───────────────┐   ┌─ ─ ─
        | InternalNode1 |   | InternalNode1 |   | InternalNode1 |   |
        └───────┬───────┘   └───────┬───────┘   └───────┬───────┘   └─ ─ ─
      ┌─────────┴────┐             ┌┴─────────────┐     └────────┐
      ▼              ▼             ▼              ▼              ▼
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌─ ─ ─
| LeafNode |   | LeafNode |   | LeafNode |   | LeafNode |   | LeafNode |   |
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘   └─ ─ ─
```

## OpenVDB

- [Origianl repo](https://github.com/AcademySoftwareFoundation/openvdb)
- [High-level summary of the terminology and basic components](https://www.openvdb.org/documentation/doxygen/overview.html)
- [Cookbook with code examples](https://www.openvdb.org/documentation/doxygen/codeExamples.html)
- Original paper from [Ken Museth](https://ken.museth.org/):
  [VDB: High-Resolution Sparse Volumes with Dynamic Topology](http://www.museth.org/Ken/Publications_files/Museth_TOG13.pdf)
- [Ken Museth](https://ken.museth.org/) explaining VDB:
  [OpenVDB: An Open Source Data Structure and Toolkit for High-Resolution Volumes](https://youtu.be/7hUH92xwODg)
- VDB on GPU:
  [Fast Fluid Simulations with Sparse Volumes on the GPU](https://www.researchgate.net/publication/325488464_Fast_Fluid_Simulations_with_Sparse_Volumes_on_the_GPU)
- [Raytracing Sparse Volumes with NVIDIA® GVDB in DesignWorks](https://developer.nvidia.com/sites/default/files/akamai/designworks/docs/GVDB_TechnicalTalk_Siggraph2016.pdf)

## Publish

1. `npm login`
2. `yarn nx build vdb`
3. `cd ./dist/libs/vdb`
4. `npm publish`
