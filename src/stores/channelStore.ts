import { IUser } from 'contexts/AuthContext';
import { Role } from 'utils/enum';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import _ from 'lodash';
import { IUserDetails } from 'queries/users';

export enum ChannelVisibilityEnum {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
  All = 'ALL',
}
export enum CHANNEL_MEMBER_STATUS {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface IChannel {
  id: string;
  name: string;
  category: { name: string; categoryId: string };
  description?: string;
  organizationId?: string;
  createdBy?: IUser;
  channelSettings?: {
    visibility: ChannelVisibilityEnum.Private | ChannelVisibilityEnum.Public;
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

export const dummyChannels: IChannel[] = [
  {
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
    channelSettings: {
      visibility: ChannelVisibilityEnum.Public,
      restriction: {
        canPost: true,
        canComment: true,
        canMakeAnnouncements: true,
      },
    },
    totalMembers: 0,
    createdAt: new Date('01-01-2024').toISOString(),
    updatedAt: new Date('01-01-2024').toISOString(),
  },
  {
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
    channelSettings: {
      visibility: ChannelVisibilityEnum.Public,
      restriction: {
        canPost: true,
        canComment: true,
        canMakeAnnouncements: true,
      },
    },
    totalMembers: 0,
    createdAt: new Date('02-01-2024').toISOString(),
    updatedAt: new Date('02-01-2024').toISOString(),
  },
  {
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
    channelSettings: {
      visibility: ChannelVisibilityEnum.Public,
      restriction: {
        canPost: true,
        canComment: true,
        canMakeAnnouncements: true,
      },
    },
    totalMembers: 0,
    createdAt: new Date('03-01-2024').toISOString(),
    updatedAt: new Date('03-01-2024').toISOString(),
  },
  {
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
    channelSettings: {
      visibility: ChannelVisibilityEnum.Private,
      restriction: {
        canPost: true,
        canComment: true,
        canMakeAnnouncements: true,
      },
    },
    isRequested: true,
    totalMembers: 100,
    createdAt: new Date('04-01-2024').toISOString(),
    updatedAt: new Date('04-01-2024').toISOString(),
  },
  {
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
    channelSettings: {
      visibility: ChannelVisibilityEnum.Private,
      restriction: {
        canPost: true,
        canComment: true,
        canMakeAnnouncements: true,
      },
    },
    isRequested: false,
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
    createdAt: new Date('05-01-2024').toISOString(),
    updatedAt: new Date('05-01-2024').toISOString(),
  },
];

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
  })),
);
