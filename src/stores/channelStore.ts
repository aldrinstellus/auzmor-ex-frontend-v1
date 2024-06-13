import { dummyChannels } from 'mocks/Channels';

import { IUser } from 'contexts/AuthContext';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import _ from 'lodash';
import { IUserDetails } from 'queries/users';

export enum CHANNEL_MEMBER_STATUS {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
export enum ChannelVisibilityEnum {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
  All = 'ALL',
}

export interface IChannel {
  id: string;
  name: string;
  category: { name: string; categoryId: string };
  description?: string;
  organizationId?: string;
  createdBy?: IUser;
  channelSettings?: {
    accessibility: ChannelVisibilityEnum.Private | ChannelVisibilityEnum.Public;
    restriction: {
      canPost: boolean;
      canComment: boolean;
      canMakeAnnouncements: boolean;
    };
  };
  isStarred?: boolean;
  totalMembers: number;
  displayIcon?: string;
  displayImage?: { id: string; original: string };
  channelBanner?: { id: string; original: string };
  isRequested?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IChannelLink {
  title: string;
  url: string;
  image?: string;
  favicon?: string;
}
export interface IChannelRequest {
  id: string;
  user?: IUserDetails;
  createdBy?: IUser;
  status: CHANNEL_MEMBER_STATUS;
  createdAt?: '';
  updatedAt?: '';
}

type State = {
  channels: { [id: string]: IChannel };
};

type Actions = {
  getChannel: (id: string) => IChannel;
  getChannels: () => IChannel[];
  setChannel: (channel: IChannel) => void;
  setChannels: (channels: { [key: string]: IChannel }) => void;
};

export const useChannelStore = create<State & Actions>()(
  immer((set, get) => ({
    channels: {},
    getChannel: (id: string) =>
      get().channels[id] || dummyChannels.find((item) => item.id === id),
    getChannels: () => _.values(get().channels),
    setChannel: (channel: IChannel) =>
      set((state) => {
        state.channels[channel.id] = channel;
      }),
    setChannels: (channels: { [key: string]: IChannel }) =>
      set((state) => {
        state.channels = { ...get().channels, ...channels };
      }),
  })),
);
