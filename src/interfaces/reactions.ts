import { ICreatedBy } from './users';

export interface IGetReaction {
  type: string;
  reaction: string;
  createdBy: ICreatedBy;
  entityId: string;
  entityType: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}
