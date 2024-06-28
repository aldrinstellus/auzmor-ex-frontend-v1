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
export enum CHANNEL_ROLE {
  Admin = 'ADMIN',
  Member = 'MEMBER',
}
export enum CHANNEL_STATUS {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export interface IChannel {
  id: string;
  name: string;
  description?: string;
  categories: { name: string; id: string }[];
  createdAt: string;
  updatedAt: string;
  organizationId?: string;
  totalMembers: number;
  status?: CHANNEL_STATUS;
  settings?: {
    visibility: ChannelVisibilityEnum;
    restriction: {
      canPost: boolean;
      canComment: boolean;
      canMakeAnnouncements: boolean;
    };
  };
  displayImage?: string;
  banner?: { original: string };
  createdBy?: IUser;
  updatedBy?: IUser;
  member: { role: CHANNEL_ROLE; bookmarked: boolean };
  joinRequest: { status: CHANNEL_MEMBER_STATUS; id?: string };
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
  updateChannel: (id: string, channel: IChannel) => void;
};

export const useChannelStore = create<State & Actions>()(
  immer((set, get) => ({
    channels: {},
    getChannel: (id: string) => get().channels[id],
    getChannels: () => _.values(get().channels),
    setChannel: (channel: IChannel) =>
      set((state) => {
        state.channels[channel.id] = channel;
      }),
    setChannels: (channels: { [key: string]: IChannel }) =>
      set((state) => {
        state.channels = { ...get().channels, ...channels };
      }),
    updateChannel: (id: string, channel: IChannel) =>
      set((state) => {
        state.channels[id] = channel;
      }),
  })),
);
