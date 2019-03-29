import { Action } from '@ngrx/store';

export enum ActionTypes {
  AddVoxel = '[Editor] Add voxel',
}

export class AddVoxel implements Action {
  readonly type = ActionTypes.AddVoxel;
}

export type ActionsUnion = AddVoxel;
