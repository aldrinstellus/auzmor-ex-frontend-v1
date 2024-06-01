import { IGetUser, UserStatus } from 'queries/users';
import {
  CHANNEL_MEMBER_STATUS,
  IChannelLink,
  IChannelRequest,
} from 'stores/channelStore';
import { Role } from 'utils/enum';

export const userData: IGetUser[] = [
  {
    id: '6516afa8dc958600e4619cdf',
    fullName: 'Sofia Rodriguez',
    firstName: 'Abby',
    lastName: 'Wolff',
    primaryEmail: 'Sim_Kris@hotmail.com',
    org: {
      id: '646311ed765368daacc601f7',
      name: 'Little LLC',
      domain: 'american-technology',
    },

    designation: {
      designationId: '65155cf3de64ba075d039879',
      name: 'Quality Assurance',
    },
    workEmail: 'Sim_Kris@hotmail.com',
    profileImage: {
      id: '653f87281ef0a90b7d1e7b54',
      blurHash: '',
      original: 'https://i.pravatar.cc/150?img=10',
    },

    flags: {
      isDeactivated: false,
      isReported: false,
    },
    createdAt: '2023-09-29T11:06:16.804Z',
    status: 'ACTIVE',
    freezeEdit: {
      firstName: true,
      middleName: true,
      lastName: true,
      fullName: true,
      designation: true,
      department: true,
      joinDate: true,
      manager: true,
    },
  },
  {
    id: '6516afa8dc958600e4619cdf',
    fullName: 'Juan Carlos Martinez',
    firstName: 'Abby',
    lastName: 'Wolff',
    primaryEmail: 'Sim_Kris@hotmail.com',

    org: {
      id: '646311ed765368daacc601f7',
      name: 'Little LLC',
      domain: 'american-technology',
    },

    designation: {
      designationId: '65155cf3de64ba075d039879',
      name: 'Quality Assurance',
    },
    workEmail: 'Sim_Kris@hotmail.com',
    profileImage: {
      id: '653f87281ef0a90b7d1e7b54',
      blurHash: '',
      original: 'https://i.pravatar.cc/150?img=39',
    },

    flags: {
      isDeactivated: false,
      isReported: false,
    },
    createdAt: '2023-09-29T11:06:16.804Z',
    status: 'ACTIVE',
    freezeEdit: {
      firstName: true,
      middleName: true,
      lastName: true,
      fullName: true,
      designation: true,
      department: true,
      joinDate: true,
      manager: true,
    },
  },
  {
    id: '6516afa8dc958600e4619cdf',
    fullName: 'Abby Wolff',
    firstName: 'Abby',
    lastName: 'Wolff',
    primaryEmail: 'Sim_Kris@hotmail.com',

    org: {
      id: '646311ed765368daacc601f7',
      name: 'Little LLC',
      domain: 'american-technology',
    },

    designation: {
      designationId: '65155cf3de64ba075d039879',
      name: 'Quality Assurance',
    },
    workEmail: 'Sim_Kris@hotmail.com',
    profileImage: {
      id: '653f87281ef0a90b7d1e7b54',
      blurHash: '',
      original:
        'https://office-qa-cdn.auzmor.com/646311ed765368daacc601f7/public/users/646311ed765368daacc601f9/profile/1698662184834-original.jpg',
    },

    flags: {
      isDeactivated: false,
      isReported: false,
    },
    createdAt: '2023-09-29T11:06:16.804Z',
    status: 'ACTIVE',
    freezeEdit: {
      firstName: true,
      middleName: true,
      lastName: true,
      fullName: true,
      designation: true,
      department: true,
      joinDate: true,
      manager: true,
    },
  },

  {
    id: '6516afa8dc958600e4619cdf',
    fullName: 'Abby Wolff',
    firstName: 'Abby',
    lastName: 'Wolff',
    primaryEmail: 'Sim_Kris@hotmail.com',

    org: {
      id: '646311ed765368daacc601f7',
      name: 'Little LLC',
      domain: 'american-technology',
    },

    designation: {
      designationId: '65155cf3de64ba075d039879',
      name: 'Quality Assurance',
    },
    workEmail: 'Sim_Kris@hotmail.com',
    profileImage: {
      id: '653f87281ef0a90b7d1e7b54',
      blurHash: '',
      original:
        'https://office-qa-cdn.auzmor.com/646311ed765368daacc601f7/public/users/646311ed765368daacc601f9/profile/1698662184834-original.jpg',
    },

    flags: {
      isDeactivated: false,
      isReported: false,
    },
    createdAt: '2023-09-29T11:06:16.804Z',
    status: 'ACTIVE',
    freezeEdit: {
      firstName: true,
      middleName: true,
      lastName: true,
      fullName: true,
      designation: true,
      department: true,
      joinDate: true,
      manager: true,
    },
  },
  {
    id: '6516afa8dc958600e4619cdf',
    fullName: 'Abby Wolff',
    firstName: 'Abby',
    lastName: 'Wolff',
    primaryEmail: 'Sim_Kris@hotmail.com',

    org: {
      id: '646311ed765368daacc601f7',
      name: 'Little LLC',
      domain: 'american-technology',
    },

    designation: {
      designationId: '65155cf3de64ba075d039879',
      name: 'Quality Assurance',
    },
    workEmail: 'Sim_Kris@hotmail.com',
    profileImage: {
      id: '653f87281ef0a90b7d1e7b54',
      blurHash: '',
      original:
        'https://office-qa-cdn.auzmor.com/646311ed765368daacc601f7/public/users/646311ed765368daacc601f9/profile/1698662184834-original.jpg',
    },

    flags: {
      isDeactivated: false,
      isReported: false,
    },
    createdAt: '2023-09-29T11:06:16.804Z',
    status: 'ACTIVE',
    freezeEdit: {
      firstName: true,
      middleName: true,
      lastName: true,
      fullName: true,
      designation: true,
      department: true,
      joinDate: true,
      manager: true,
    },
  },
  {
    id: '6516afa8dc958600e4619cdf',
    fullName: 'Abby Wolff',
    firstName: 'Abby',
    lastName: 'Wolff',
    primaryEmail: 'Sim_Kris@hotmail.com',

    org: {
      id: '646311ed765368daacc601f7',
      name: 'Little LLC',
      domain: 'american-technology',
    },

    designation: {
      designationId: '65155cf3de64ba075d039879',
      name: 'Quality Assurance',
    },
    workEmail: 'Sim_Kris@hotmail.com',
    profileImage: {
      id: '653f87281ef0a90b7d1e7b54',
      blurHash: '',
      original:
        'https://office-qa-cdn.auzmor.com/646311ed765368daacc601f7/public/users/646311ed765368daacc601f9/profile/1698662184834-original.jpg',
    },

    flags: {
      isDeactivated: false,
      isReported: false,
    },
    createdAt: '2023-09-29T11:06:16.804Z',
    status: 'ACTIVE',
    freezeEdit: {
      firstName: true,
      middleName: true,
      lastName: true,
      fullName: true,
      designation: true,
      department: true,
      joinDate: true,
      manager: true,
    },
  },
  {
    id: '6516afa8dc958600e4619cdf',
    fullName: 'Abby Wolff',
    firstName: 'Abby',
    lastName: 'Wolff',
    primaryEmail: 'Sim_Kris@hotmail.com',

    org: {
      id: '646311ed765368daacc601f7',
      name: 'Little LLC',
      domain: 'american-technology',
    },

    designation: {
      designationId: '65155cf3de64ba075d039879',
      name: 'Quality Assurance',
    },
    workEmail: 'Sim_Kris@hotmail.com',
    profileImage: {
      id: '653f87281ef0a90b7d1e7b54',
      blurHash: '',
      original:
        'https://office-qa-cdn.auzmor.com/646311ed765368daacc601f7/public/users/646311ed765368daacc601f9/profile/1698662184834-original.jpg',
    },

    flags: {
      isDeactivated: false,
      isReported: false,
    },
    createdAt: '2023-09-29T11:06:16.804Z',
    status: 'ACTIVE',
    freezeEdit: {
      firstName: true,
      middleName: true,
      lastName: true,
      fullName: true,
      designation: true,
      department: true,
      joinDate: true,
      manager: true,
    },
  },
  {
    id: '6516afa8dc958600e4619cdf',
    fullName: 'Abby Wolff',
    firstName: 'Abby',
    lastName: 'Wolff',
    primaryEmail: 'Sim_Kris@hotmail.com',

    org: {
      id: '646311ed765368daacc601f7',
      name: 'Little LLC',
      domain: 'american-technology',
    },

    designation: {
      designationId: '65155cf3de64ba075d039879',
      name: 'Quality Assurance',
    },
    workEmail: 'Sim_Kris@hotmail.com',
    profileImage: {
      id: '653f87281ef0a90b7d1e7b54',
      blurHash: '',
      original:
        'https://office-qa-cdn.auzmor.com/646311ed765368daacc601f7/public/users/646311ed765368daacc601f9/profile/1698662184834-original.jpg',
    },

    flags: {
      isDeactivated: false,
      isReported: false,
    },
    createdAt: '2023-09-29T11:06:16.804Z',
    status: 'ACTIVE',
    freezeEdit: {
      firstName: true,
      middleName: true,
      lastName: true,
      fullName: true,
      designation: true,
      department: true,
      joinDate: true,
      manager: true,
    },
  },
  {
    id: '6516afa8dc958600e4619cdf',
    fullName: 'Abby Wolff',
    firstName: 'Abby',
    lastName: 'Wolff',
    primaryEmail: 'Sim_Kris@hotmail.com',

    org: {
      id: '646311ed765368daacc601f7',
      name: 'Little LLC',
      domain: 'american-technology',
    },

    designation: {
      designationId: '65155cf3de64ba075d039879',
      name: 'Quality Assurance',
    },
    workEmail: 'Sim_Kris@hotmail.com',
    profileImage: {
      id: '653f87281ef0a90b7d1e7b54',
      blurHash: '',
      original:
        'https://office-qa-cdn.auzmor.com/646311ed765368daacc601f7/public/users/646311ed765368daacc601f9/profile/1698662184834-original.jpg',
    },

    flags: {
      isDeactivated: false,
      isReported: false,
    },
    createdAt: '2023-09-29T11:06:16.804Z',
    status: 'ACTIVE',
    freezeEdit: {
      firstName: true,
      middleName: true,
      lastName: true,
      fullName: true,
      designation: true,
      department: true,
      joinDate: true,
      manager: true,
    },
  },
  {
    id: '6516afa8dc958600e4619cdf',
    fullName: 'Abby Wolff',
    firstName: 'Abby',
    lastName: 'Wolff',
    primaryEmail: 'Sim_Kris@hotmail.com',

    org: {
      id: '646311ed765368daacc601f7',
      name: 'Little LLC',
      domain: 'american-technology',
    },

    designation: {
      designationId: '65155cf3de64ba075d039879',
      name: 'Quality Assurance',
    },
    workEmail: 'Sim_Kris@hotmail.com',
    profileImage: {
      id: '653f87281ef0a90b7d1e7b54',
      blurHash: '',
      original:
        'https://office-qa-cdn.auzmor.com/646311ed765368daacc601f7/public/users/646311ed765368daacc601f9/profile/1698662184834-original.jpg',
    },

    flags: {
      isDeactivated: false,
      isReported: false,
    },
    createdAt: '2023-09-29T11:06:16.804Z',
    status: 'ACTIVE',
    freezeEdit: {
      firstName: true,
      middleName: true,
      lastName: true,
      fullName: true,
      designation: true,
      department: true,
      joinDate: true,
      manager: true,
    },
  },
];
export const ChannelUserRequests: IChannelRequest[] = [
  {
    id: '64de11da64ff441b033c3b0d',
    user: {
      userId: '6516afa8dc958600e4619cdf',
      email: 'Sim_Kris@hotmail.com',
      fullName: 'Sofia Rodriguez',
      status: UserStatus.Created,
      designation: 'Quality Assurance',
      department: 'Grocery',
      workLocation: 'South Freeman',
      profileImage: {
        id: '653f87281ef0a90b7d1e7b54',
        original: 'https://i.pravatar.cc/150?img=10',
        blurHash: '',
      },
    },
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
    status: CHANNEL_MEMBER_STATUS.PENDING,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: '64de11da64ff441b033c3b0d',
    user: {
      userId: '6516afa8dc958600e4619cdf',
      email: 'Sim_Kris@hotmail.com',
      fullName: 'Elena Ivanova',
      status: UserStatus.Created,
      designation: 'Quality Assurance',
      department: 'Grocery',
      workLocation: 'South Freeman',

      profileImage: {
        id: '653f87281ef0a90b7d1e7b54',
        original: 'https://i.pravatar.cc/150?img=66',
        blurHash: '',
      },
    },
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
    status: CHANNEL_MEMBER_STATUS.PENDING,
    createdAt: '',
    updatedAt: '',
  },

  {
    id: '64de11da64ff441b033c3b0d',
    user: {
      userId: '6516afa8dc958600e4619cdf',
      email: 'Sim_Kris@hotmail.com',
      fullName: 'Hiroshi Yamamoto',
      status: UserStatus.Created,
      designation: 'Quality Assurance',
      department: 'Grocery',
      workLocation: 'South Freeman',
      profileImage: {
        id: '653f87281ef0a90b7d1e7b54',
        original: 'https://i.pravatar.cc/150?img=67',

        blurHash: '',
      },
    },
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
    status: CHANNEL_MEMBER_STATUS.PENDING,
    createdAt: '',
    updatedAt: '',
  },
];
export const channelAdmins = [
  {
    userId: '6516afa8dc958600e4619cdf',
    email: 'Sim_Kris@hotmail.com',
    fullName: 'Abby Wolff',
    status: 'ACTIVE',
    designation: 'Quality Assurance',
    department: 'Grocery',
    profileImage: {
      id: '653f87281ef0a90b7d1e7b54',
      original:
        'https://office-qa-cdn.auzmor.com/646311ed765368daacc601f7/public/users/646311ed765368daacc601f9/profile/1698662184834-original.jpg',
      blurHash: '',
    },
  },
  {
    userId: '6516afa8dc958600e4619cdf',
    email: 'Sim_Kris@hotmail.com',
    fullName: 'Abby Wolff',
    status: 'ACTIVE',
    designation: 'Quality Assurance',
    department: 'Grocery',
    profileImage: {
      id: '653f87281ef0a90b7d1e7b54',
      original:
        'https://office-qa-cdn.auzmor.com/646311ed765368daacc601f7/public/users/646311ed765368daacc601f9/profile/1698662184834-original.jpg',
      blurHash: '',
    },
  },
];

export const channelLinks: IChannelLink[] = [
  {
    title: 'Contracts',
    url: 'www.twitter.com',
    favicon:
      'https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg',
  },
  {
    title: 'Open Opportunities',
    url: 'www.office.auzmor.com',
    favicon: 'https://office.auzmor.com/favicon.ico',
  },
  { title: 'Lost Opportunities', url: 'www.auzmor.com/office' },
  { title: 'Case study - Healthcare', url: 'www.google.com' },
];
