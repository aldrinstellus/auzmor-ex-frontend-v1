import { ITeam } from './teams';
import { IGetUser, User } from './users';

export enum AudienceEntityType {
  User = 'USER',
  Team = 'TEAM',
  Channel = 'CHANNEL',
  All = 'ALL',
}
export interface IAudience {
  id?: string;
  entityType: AudienceEntityType;
  entityId: string;
  name?: string;
  entity?: ITeam | IGetUser | false; // | IChannel
  totalMembers?: number | null;
  recentMembers?: User[] | null;
  category?: string | null;
  description?: string;
  profileImage?: string;
}
