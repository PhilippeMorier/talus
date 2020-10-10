import { Vec3 } from '@talus/vdb';
import { getMeshName } from './scene-viewer.service';

describe('UiSceneViewerService', () => {
  it('gets mesh name', () => {
    expect(getMeshName(new Vec3(0, 1, 2))).toEqual('node1 {"x":0,"y":1,"z":2}');
  });
});
