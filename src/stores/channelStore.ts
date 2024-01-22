import { IUser } from 'contexts/AuthContext';
import { Role } from 'utils/enum';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import _ from 'lodash';

export enum ChannelPrivacyEnum {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}

export interface IChannel {
  id: string;
  name: string;
  category: string;
  privacy: ChannelPrivacyEnum;
  description?: string;
  owner: IUser;
  coverImage?: {
    original: string;
    id: string;
    blurHash?: string;
  };
  profileImage?: {
    original: string;
    id: string;
    blurHash?: string;
  };
  isStarred?: boolean;
  membersCount: number;
}

type State = {
  channels: { [id: string]: IChannel };
};

type Actions = {
  getChannel: (id: string) => IChannel;
  getChannels: () => IChannel[];
  setChannel: (channel: IChannel) => void;
};

const dummyChannels: { [key: string]: IChannel } = {
  id_1: {
    id: 'id_1',
    name: 'Channel 1',
    category: 'marketing',
    privacy: ChannelPrivacyEnum.Public,
    owner: {
      id: '6465d142c62ae5de85d33b83',
      name: 'Dhruvin Modi',
      email: 'dhruvinmodi2015@gmail.com',
      role: Role.SuperAdmin,
      organization: {
        domain: 'incendia',
        id: '6465d142c62ae5de85d33b81',
      },
    },
    membersCount: 0,
  },
  id_2: {
    id: 'id_2',
    name: 'Channel 2',
    category: 'marketing',
    privacy: ChannelPrivacyEnum.Private,
    owner: {
      id: '6465d142c62ae5de85d33b83',
      name: 'Dhruvin Modi',
      email: 'dhruvinmodi2015@gmail.com',
      role: Role.SuperAdmin,
      organization: {
        domain: 'incendia',
        id: '6465d142c62ae5de85d33b81',
      },
    },
    membersCount: 0,
  },
  id_3: {
    id: 'id_3',
    name: 'Channel 3',
    category: 'marketing',
    privacy: ChannelPrivacyEnum.Public,
    description: 'short description',
    owner: {
      id: '6465d142c62ae5de85d33b83',
      name: 'Dhruvin Modi',
      email: 'dhruvinmodi2015@gmail.com',
      role: Role.SuperAdmin,
      organization: {
        domain: 'incendia',
        id: '6465d142c62ae5de85d33b81',
      },
    },
    membersCount: 0,
  },
  id_4: {
    id: 'id_4',
    name: 'Channel 4',
    category: 'marketing',
    privacy: ChannelPrivacyEnum.Public,
    description:
      'Veryyy lloonngg long long description. Veryyy lloonngg long long description Veryyy lloonngg long long description',
    owner: {
      id: '6465d142c62ae5de85d33b83',
      name: 'Dhruvin Modi',
      email: 'dhruvinmodi2015@gmail.com',
      role: Role.SuperAdmin,
      organization: {
        domain: 'incendia',
        id: '6465d142c62ae5de85d33b81',
      },
    },
    membersCount: 100,
  },
  id_5: {
    id: 'id_5',
    name: 'Channel 5',
    category: 'marketing',
    privacy: ChannelPrivacyEnum.Public,
    description: 'This is a description.',
    owner: {
      id: '6465d142c62ae5de85d33b83',
      name: 'Dhruvin Modi',
      email: 'dhruvinmodi2015@gmail.com',
      role: Role.SuperAdmin,
      organization: {
        domain: 'incendia',
        id: '6465d142c62ae5de85d33b81',
      },
    },
    membersCount: 3,
    coverImage: {
      id: '65aa56820cf68601b2ff3817',
      original:
        'https://office-dev-cdn.auzmor.com/6465d142c62ae5de85d33b81/public/users/6465d142c62ae5de85d33b83/cover/1705662082064-original.jpg',
    },
    profileImage: {
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
  })),
);
