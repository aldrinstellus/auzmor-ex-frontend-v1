export const getCommentsApi = async () => {
  return [
    {
      id: '1',
      body: 'First comment',
      username: 'Jack',
      userId: '1',
      parentId: null,
      createdAt: '2021-08-16T23:00:33.010+02:00',
      designation: 'Talent Acquisition Specialist',
      likes: ['1', '2', '3'],
    },
    {
      id: '2',
      body: 'Second comment',
      username: 'John',
      userId: '2',
      parentId: null,
      createdAt: '2021-08-16T23:00:33.010+02:00',
      designation: 'Talent Acquisition Specialist',
      likes: [],
    },
    {
      id: '3',
      body: 'First comment first child',
      username: 'John',
      userId: '2',
      parentId: '1',
      createdAt: '2021-08-16T23:00:33.010+02:00',
      designation: 'Talent Acquisition Specialist',
      likes: [],
    },
    {
      id: '4',
      body: 'abc abc abc second comment first chld',
      username: 'John',
      userId: '2',
      parentId: '2',
      createdAt: '2021-08-16T23:00:33.010+02:00',
      designation: 'Talent Acquisition Specialist',
      likes: [],
    },
  ];
};
