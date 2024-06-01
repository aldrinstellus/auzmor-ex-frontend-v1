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

export const dummyChannels: IChannel[] = [
  {
    id: '1',
    name: 'Core Data Science',
    category: { categoryId: 'cat1', name: 'marketing' },
    description: 'Empowering with data-driven knowledge',
    createdBy: {
      id: '6465d142c62ae5de85d33b83',
      name: 'Dhruvin Modi',
      email: 'dhruvinmodi2015@gmail.com',
      role: Role.SuperAdmin,
      organization: {
        domain: 'incendia',
        id: '6465d142c62ae5de85d33b81',
        name: 'incendia',
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
    totalMembers: 24,
    displayImage: {
      id: '1',
      original: '',
    },
    channelBanner: {
      id: '1',
      original:
        'https://images.unsplash.com/photo-1599658880436-c61792e70672?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    createdAt: new Date('08-01-2024').toISOString(),
    updatedAt: new Date('08-01-2024').toISOString(),
  },
  {
    id: '2',
    name: 'DEI Employee Resources',
    category: { categoryId: 'cat1', name: 'marketing' },
    description: 'Sharing resources for equity and inclusion',
    createdBy: {
      id: '6465d142c62ae5de85d33b83',
      name: 'Dhruvin Modi',
      email: 'dhruvinmodi2015@gmail.com',
      role: Role.SuperAdmin,
      organization: {
        domain: 'incendia',
        id: '6465d142c62ae5de85d33b81',
        name: 'incendia',
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
    totalMembers: 68,
    displayImage: {
      id: '2',
      original: '',
    },
    channelBanner: {
      id: '2',
      original:
        'https://images.unsplash.com/photo-1576267423429-569309b31e84?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    createdAt: new Date('07-01-2024').toISOString(),
    updatedAt: new Date('07-01-2024').toISOString(),
  },
  {
    id: '3',
    name: 'Data Innovation League',
    category: { categoryId: 'cat1', name: 'marketing' },
    description: 'Join the movement of data innovators',
    createdBy: {
      id: '6465d142c62ae5de85d33b83',
      name: 'Dhruvin Modi',
      email: 'dhruvinmodi2015@gmail.com',
      role: Role.SuperAdmin,
      organization: {
        domain: 'incendia',
        id: '6465d142c62ae5de85d33b81',
        name: 'incendia',
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
    totalMembers: 49,
    displayImage: {
      id: '3',
      original: '',
    },
    channelBanner: {
      id: '3',
      original:
        'https://plus.unsplash.com/premium_photo-1695807489199-4ba908b63826?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    createdAt: new Date('06-01-2024').toISOString(),
    updatedAt: new Date('06-01-2024').toISOString(),
  },
  {
    id: '4',
    name: 'Business Development',
    category: { categoryId: 'cat1', name: 'marketing' },
    description:
      'Fuel your business development journey and empower you with the best',
    createdBy: {
      id: '6465d142c62ae5de85d33b83',
      name: 'Dhruvin Modi',
      email: 'dhruvinmodi2015@gmail.com',
      role: Role.SuperAdmin,
      organization: {
        domain: 'incendia',
        id: '6465d142c62ae5de85d33b81',
        name: 'incendia',
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
    displayImage: {
      id: '4',
      original: '',
    },
    channelBanner: {
      id: '4',
      original:
        'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    totalMembers: 24,
    createdAt: new Date('05-01-2024').toISOString(),
    updatedAt: new Date('05-01-2024').toISOString(),
  },
  {
    id: '5',
    name: 'Finance',
    category: { categoryId: 'cat1', name: 'marketing' },
    description: 'Navigating the World of Finance with Confidence!',
    createdBy: {
      id: '6465d142c62ae5de85d33b83',
      name: 'Dhruvin Modi',
      email: 'dhruvinmodi2015@gmail.com',
      role: Role.SuperAdmin,
      organization: {
        domain: 'incendia',
        id: '6465d142c62ae5de85d33b81',
        name: 'incendia',
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
    totalMembers: 25,
    displayImage: {
      id: '5',
      original:
        'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    channelBanner: {
      id: '5',
      original:
        'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    isStarred: true,
    createdAt: new Date('04-01-2024').toISOString(),
    updatedAt: new Date('04-01-2024').toISOString(),
  },
  {
    id: '6',
    name: 'Accounting',
    category: { categoryId: 'cat1', name: 'marketing' },
    description: 'Financial management for everyone',
    createdBy: {
      id: '6465d142c62ae5de85d33b83',
      name: 'Dhruvin Modi',
      email: 'dhruvinmodi2015@gmail.com',
      role: Role.SuperAdmin,
      organization: {
        domain: 'incendia',
        id: '6465d142c62ae5de85d33b81',
        name: 'incendia',
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
    totalMembers: 24,
    displayImage: {
      id: '6',
      original: '',
    },
    channelBanner: {
      id: '6',
      original:
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    isStarred: true,
    createdAt: new Date('03-01-2024').toISOString(),
    updatedAt: new Date('03-01-2024').toISOString(),
  },
  {
    id: '7',
    name: 'Arts and design',
    category: { categoryId: 'cat1', name: 'marketing' },
    description:
      'Discover new techniques and find the inspiration to bring your visions to life.',
    createdBy: {
      id: '6465d142c62ae5de85d33b83',
      name: 'Dhruvin Modi',
      email: 'dhruvinmodi2015@gmail.com',
      role: Role.SuperAdmin,
      organization: {
        domain: 'incendia',
        id: '6465d142c62ae5de85d33b81',
        name: 'incendia',
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
    totalMembers: 68,
    displayImage: {
      id: '7',
      original: '',
    },
    channelBanner: {
      id: '7',
      original:
        'https://images.unsplash.com/photo-1491245338813-c6832976196e?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    isStarred: true,
    createdAt: new Date('02-01-2024').toISOString(),
    updatedAt: new Date('02-01-2024').toISOString(),
  },
  {
    id: '8',
    name: 'Media and communication',
    category: { categoryId: 'cat1', name: 'marketing' },
    description:
      'Traditional journalism, social media, podcasting, and beyond.',
    createdBy: {
      id: '6465d142c62ae5de85d33b83',
      name: 'Dhruvin Modi',
      email: 'dhruvinmodi2015@gmail.com',
      role: Role.SuperAdmin,
      organization: {
        domain: 'incendia',
        id: '6465d142c62ae5de85d33b81',
        name: 'incendia',
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
    totalMembers: 35,
    displayImage: {
      id: '8',
      original: '',
    },
    channelBanner: {
      id: '8',
      original:
        'https://images.unsplash.com/photo-1625123627242-97ef1000c6d1?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    isStarred: true,
    createdAt: new Date('01-01-2024').toISOString(),
    updatedAt: new Date('01-01-2024').toISOString(),
  },
];

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
