import { IGetUser, UserStatus } from 'queries/users';
import { IChannel, IChannelLink, IChannelRequest } from 'stores/channelStore';
import { Role } from 'utils/enum';

enum CHANNEL_MEMBER_STATUS {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
enum ChannelVisibilityEnum {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
  All = 'ALL',
}

export const admins = [
  {
    id: 1,
    name: 'Emilia Santos',
    image: 'https://i.pravatar.cc/150?img=40',
    designation: 'Talent Acquistion Specialist',
    isOwner: true,
  },
  {
    id: 2,
    name: 'Andreas Müller',
    image: 'https://i.pravatar.cc/150?img=41',
    designation: 'Talent Acquistion Specialist',
    isOwner: false,
  },
  {
    id: 3,
    name: 'Mei Chen',
    image: 'https://i.pravatar.cc/150?img=42',
    designation: 'Talent Acquistion Specialist',
    isOwner: false,
  },
];
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
    createdAt: new Date('2024-05-01').toISOString(),
    updatedAt: new Date('2024-05-01').toISOString(),
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
    createdAt: new Date('2024-05-02').toISOString(),
    updatedAt: new Date('2024-05-02').toISOString(),
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
    createdAt: new Date('2024-05-03').toISOString(),
    updatedAt: new Date('2024-05-03').toISOString(),
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
    createdAt: new Date('2024-05-04').toISOString(),
    updatedAt: new Date('2024-05-04').toISOString(),
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
    createdAt: new Date('2024-05-05').toISOString(),
    updatedAt: new Date('2024-05-05').toISOString(),
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
    createdAt: new Date('2024-05-06').toISOString(),
    updatedAt: new Date('2024-05-06').toISOString(),
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
    createdAt: new Date('2024-05-07').toISOString(),
    updatedAt: new Date('2024-05-07').toISOString(),
  },
  {
    id: '8',
    name: 'Media and communication',
    category: { categoryId: 'cat1', name: 'marketing' },
    description:
      'Traditional ajkssssssssssdnjkasndjanskdnkasndkjnakjsdnjkasndjkbakjsbdjkbaskjdbjkasbdkjasbdkjabsdkjasbdjkabsjkdbkjasbdasjdbkjasbdkjasdjbasjk asjbdkjasdjkbaskjdb kjbasjkdbjasd asjkndkjasnd jknsjkadnkasjn',
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
    createdAt: new Date('2024-05-08').toISOString(),
    updatedAt: new Date('2024-05-08').toISOString(),
  },
];

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
