import {
  CHANNEL_ROLE,
  CHANNEL_STATUS,
  ChannelVisibilityEnum,
} from 'stores/channelStore';

export interface IChannelMembersPayload {
  users?: { id: string; role: CHANNEL_ROLE }[];
  teams?: { id: string; role: CHANNEL_ROLE }[];
}

export interface IChannelPayload {
  name?: string;
  categoryIds?: string[];
  description?: string;
  settings?: { visibility?: ChannelVisibilityEnum };
  status?: CHANNEL_STATUS;
}
