import { IUser } from 'contexts/AuthContext';
import { Role } from 'utils/enum';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import _ from 'lodash';

export enum ChannelVisibilityEnum {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}

export interface IChannel {
  id: string;
  name: string;
  category: { name: string; categoryId: string };
  description?: string;
  organizationId?: string;
  createdBy?: IUser;
  channelSettings?: {
    visibility: ChannelVisibilityEnum;
    restriction: {
      canPost: boolean;
      canComment: boolean;
      canMakeAnnouncements: boolean;
    };
  };
  isStarred?: boolean;
  totalMembers: number;
  displayImage?: { id: string; original: string };
  channelBanner?: { id: string; original: string };
  createdAt?: '2024-01-17T06:45:04.545Z';
  updatedAt?: '2024-01-17T06:45:04.545Z';
}

export interface IChannelLink {
  title: string;
  url: string;
  image?: string;
  favicon?: string;
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

const dummyChannels: { [key: string]: IChannel } = {
  id_1: {
    id: 'id_1',
    name: 'Channel 1',
    category: { categoryId: 'cat1', name: 'marketing' },
    createdBy: {
      id: '6465d142c62ae5de85d33b83',
      name: 'Dhruvin Modi',
      email: 'dhruvinmodi2015@gmail.com',
      role: Role.SuperAdmin,
      organization: {
        domain: 'incendia',
        id: '6465d142c62ae5de85d33b81',
      },
    },
    totalMembers: 0,
  },
  id_2: {
    id: 'id_2',
    name: 'Channel 2',
    category: { categoryId: 'cat1', name: 'marketing' },
    createdBy: {
      id: '6465d142c62ae5de85d33b83',
      name: 'Dhruvin Modi',
      email: 'dhruvinmodi2015@gmail.com',
      role: Role.SuperAdmin,
      organization: {
        domain: 'incendia',
        id: '6465d142c62ae5de85d33b81',
      },
    },
    totalMembers: 0,
  },
  id_3: {
    id: 'id_3',
    name: 'Channel 3',
    category: { categoryId: 'cat1', name: 'marketing' },
    description: 'short description',
    createdBy: {
      id: '6465d142c62ae5de85d33b83',
      name: 'Dhruvin Modi',
      email: 'dhruvinmodi2015@gmail.com',
      role: Role.SuperAdmin,
      organization: {
        domain: 'incendia',
        id: '6465d142c62ae5de85d33b81',
      },
    },
    totalMembers: 0,
  },
  id_4: {
    id: 'id_4',
    name: 'Channel 4',
    category: { categoryId: 'cat1', name: 'marketing' },
    description:
      'Veryyy lloonngg long long description. Veryyy lloonngg long long description Veryyy lloonngg long long description',
    createdBy: {
      id: '6465d142c62ae5de85d33b83',
      name: 'Dhruvin Modi',
      email: 'dhruvinmodi2015@gmail.com',
      role: Role.SuperAdmin,
      organization: {
        domain: 'incendia',
        id: '6465d142c62ae5de85d33b81',
      },
    },
    totalMembers: 100,
  },
  id_5: {
    id: 'id_5',
    name: 'Channel 5',
    category: { categoryId: 'cat1', name: 'marketing' },
    description: 'This is a description.',
    createdBy: {
      id: '6465d142c62ae5de85d33b83',
      name: 'Dhruvin Modi',
      email: 'dhruvinmodi2015@gmail.com',
      role: Role.SuperAdmin,
      organization: {
        domain: 'incendia',
        id: '6465d142c62ae5de85d33b81',
      },
    },
    totalMembers: 3,
    displayImage: {
      id: '65aa56820cf68601b2ff3817',
      original:
        'https://office-dev-cdn.auzmor.com/6465d142c62ae5de85d33b81/public/users/6465d142c62ae5de85d33b83/cover/1705662082064-original.jpg',
    },
    channelBanner: {
      id: '65aa57000cf68601b2ff3828',
      original:
        'https://office-dev-cdn.auzmor.com/6465d142c62ae5de85d33b81/public/users/6465d142c62ae5de85d33b83/profile/1705662208516-original.png',
    },
    isStarred: true,
  },
};

export const useChannelStore = create<State & Actions>()(
  immer((set, get) => ({
    channels: dummyChannels,
    getChannel: (id: string) => get().channels[id],
    getChannels: () => _.values(get().channels),
    setChannel: (channel: IChannel) =>
      set((state) => (state.channels[channel.id] = channel)),
    setChannels: (channels: { [key: string]: IChannel }) =>
      set((state) => (state.channels = { ...state.channels, ...channels })),
  })),
);
