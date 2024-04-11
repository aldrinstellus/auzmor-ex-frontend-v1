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
    fullName: 'Abby Wolff',
    firstName: 'Abby',
    lastName: 'Wolff',
    primaryEmail: 'Sim_Kris@hotmail.com',
    department: {
      departmentId: '6516afa8dc958600e4619c07',
      name: 'Grocery',
    },
    org: {
      id: '646311ed765368daacc601f7',
      name: 'Little LLC',
      domain: 'american-technology',
    },
    workLocation: {
      locationId: '6516afa8dc958600e4619c73',
      name: 'South Freeman',
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
    department: {
      departmentId: '6516afa8dc958600e4619c07',
      name: 'Grocery',
    },
    org: {
      id: '646311ed765368daacc601f7',
      name: 'Little LLC',
      domain: 'american-technology',
    },
    workLocation: {
      locationId: '6516afa8dc958600e4619c73',
      name: 'South Freeman',
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
    department: {
      departmentId: '6516afa8dc958600e4619c07',
      name: 'Grocery',
    },
    org: {
      id: '646311ed765368daacc601f7',
      name: 'Little LLC',
      domain: 'american-technology',
    },
    workLocation: {
      locationId: '6516afa8dc958600e4619c73',
      name: 'South Freeman',
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
    department: {
      departmentId: '6516afa8dc958600e4619c07',
      name: 'Grocery',
    },
    org: {
      id: '646311ed765368daacc601f7',
      name: 'Little LLC',
      domain: 'american-technology',
    },
    workLocation: {
      locationId: '6516afa8dc958600e4619c73',
      name: 'South Freeman',
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
    department: {
      departmentId: '6516afa8dc958600e4619c07',
      name: 'Grocery',
    },
    org: {
      id: '646311ed765368daacc601f7',
      name: 'Little LLC',
      domain: 'american-technology',
    },
    workLocation: {
      locationId: '6516afa8dc958600e4619c73',
      name: 'South Freeman',
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
    department: {
      departmentId: '6516afa8dc958600e4619c07',
      name: 'Grocery',
    },
    org: {
      id: '646311ed765368daacc601f7',
      name: 'Little LLC',
      domain: 'american-technology',
    },
    workLocation: {
      locationId: '6516afa8dc958600e4619c73',
      name: 'South Freeman',
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
    department: {
      departmentId: '6516afa8dc958600e4619c07',
      name: 'Grocery',
    },
    org: {
      id: '646311ed765368daacc601f7',
      name: 'Little LLC',
      domain: 'american-technology',
    },
    workLocation: {
      locationId: '6516afa8dc958600e4619c73',
      name: 'South Freeman',
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
    department: {
      departmentId: '6516afa8dc958600e4619c07',
      name: 'Grocery',
    },
    org: {
      id: '646311ed765368daacc601f7',
      name: 'Little LLC',
      domain: 'american-technology',
    },
    workLocation: {
      locationId: '6516afa8dc958600e4619c73',
      name: 'South Freeman',
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
    department: {
      departmentId: '6516afa8dc958600e4619c07',
      name: 'Grocery',
    },
    org: {
      id: '646311ed765368daacc601f7',
      name: 'Little LLC',
      domain: 'american-technology',
    },
    workLocation: {
      locationId: '6516afa8dc958600e4619c73',
      name: 'South Freeman',
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
    department: {
      departmentId: '6516afa8dc958600e4619c07',
      name: 'Grocery',
    },
    org: {
      id: '646311ed765368daacc601f7',
      name: 'Little LLC',
      domain: 'american-technology',
    },
    workLocation: {
      locationId: '6516afa8dc958600e4619c73',
      name: 'South Freeman',
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
    id: '6516afb0dc958600e461ab27',
    fullName: 'Adaline  popo',
    firstName: 'Adaline',
    lastName: 'Mills',
    primaryEmail: 'Isom_Mills@hotmail.com',
    department: {
      departmentId: '658af7f506b573a7ebc9f728',
      name: 'test department',
    },
    org: {
      id: '646311ed765368daacc601f7',
      name: 'Stokes, Dickens and Emmerich',
      domain: 'american-technology',
    },
    workLocation: {
      locationId: '6516afa8dc958600e4619c1b',
      name: 'Concord',
    },
    designation: {
      designationId: '65801415713f71214c69604b',
      name: 'Performance Enginneer',
    },
    workEmail: 'Isom_Mills@hotmail.com',

    flags: {
      isDeactivated: false,
      isReported: false,
    },
    createdAt: '2023-09-29T11:06:24.308Z',
    status: 'ACTIVE',
    freezeEdit: {
      firstName: true,
      middleName: true,
      lastName: true,
      fullName: true,
      designation: true,
      department: true,
      joinDate: false,
      manager: true,
    },
  },
  {
    id: '6516afabdc958600e461a1af',
    fullName: "Alex D'Amore",
    firstName: 'Alex',
    lastName: "D'Amore",
    primaryEmail: 'Aurelie83@hotmail.com',
    department: {
      departmentId: '6516afa8dc958600e4619c17',
      name: 'Books',
    },
    org: {
      id: '646311ed765368daacc601f7',
      name: 'Herman - Zieme',
      domain: 'american-technology',
    },
    workLocation: {
      locationId: '6516afa8dc958600e4619c29',
      name: 'Larsonville',
    },
    workEmail: 'Aurelie83@hotmail.com',

    flags: {
      isDeactivated: false,
      isReported: false,
    },
    createdAt: '2023-09-29T11:06:19.561Z',
    status: 'ACTIVE',
    freezeEdit: {
      firstName: false,
      middleName: false,
      lastName: false,
      fullName: false,
      designation: false,
      department: false,
      joinDate: true,
      manager: true,
    },
  },
  {
    id: '6516afabdc958600e461a21f',
    fullName: 'Alfonso Bosco',
    firstName: 'Alfonso',
    lastName: 'Bosco',
    primaryEmail: 'Frederic98@hotmail.com',
    department: {
      departmentId: '6516afa8dc958600e4619c03',
      name: 'Movies',
    },
    org: {
      id: '646311ed765368daacc601f7',
      name: 'Turcotte, Casper and Runte',
      domain: 'american-technology',
    },
    workLocation: {
      locationId: '6516afa8dc958600e4619c57',
      name: 'Port Cierramouth',
    },
    workEmail: 'Frederic98@hotmail.com',

    flags: {
      isDeactivated: false,
      isReported: false,
    },
    createdAt: '2023-09-29T11:06:19.754Z',
    status: 'ACTIVE',
    freezeEdit: {
      firstName: false,
      middleName: false,
      lastName: false,
      fullName: false,
      designation: false,
      department: false,
      joinDate: false,
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
      fullName: 'Abby Wolff',
      status: UserStatus.Created,
      designation: 'Quality Assurance',
      department: 'Grocery',
      workLocation: 'South Freeman',
      profileImage: {
        id: '653f87281ef0a90b7d1e7b54',
        original:
          'https://office-qa-cdn.auzmor.com/646311ed765368daacc601f7/public/users/646311ed765368daacc601f9/profile/1698662184834-original.jpg',
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
      fullName: 'Abby Wolff',
      status: UserStatus.Created,
      designation: 'Quality Assurance',
      department: 'Grocery',
      workLocation: 'South Freeman',

      profileImage: {
        id: '653f87281ef0a90b7d1e7b54',
        original:
          'https://office-qa-cdn.auzmor.com/646311ed765368daacc601f7/public/users/646311ed765368daacc601f9/profile/1698662184834-original.jpg',
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
      fullName: 'Abby Wolff',
      status: UserStatus.Created,
      designation: 'Quality Assurance',
      department: 'Grocery',
      workLocation: 'South Freeman',
      profileImage: {
        id: '653f87281ef0a90b7d1e7b54',
        original:
          'https://office-qa-cdn.auzmor.com/646311ed765368daacc601f7/public/users/646311ed765368daacc601f9/profile/1698662184834-original.jpg',
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
