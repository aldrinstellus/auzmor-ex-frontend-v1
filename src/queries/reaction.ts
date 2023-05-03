import apiService from 'utils/apiService';

interface IReactions {
  entityId: string;
  entityType: string;
  type: string;
}

export const createReaction = async (payload: IReactions) => {
  console.log(payload);
  const data = await apiService.post('/reactions', payload);
  return new Promise((res) => {
    res(data);
  });
};

export const getReactions = async (entityId: string, entityType: string) => {
  const { data } = await apiService.get(
    `reactions?entityId=${entityId}&entityType=${entityType}`,
  );
  return data;
};

export const deleteReaction = async (
  id: string,
  entityId: string,
  entityType: string,
) => {
  const data = await apiService.delete(
    `/reactions/${id}?entityId=${entityId}&entityType=${entityType}`,
    {},
  );
  return new Promise((res) => {
    res(data);
  });
};

// export const deleteReactions = async (id: string) => {
//   const data = await apiService.delete(`/reactions/${id}`, {});
//   return new Promise((res) => {
//     res(data);
//   });
// };

export const getComments = async (
  entityId: string,
  entityType: string,
  limit: number,
  page: number,
) => {
  const { data } = await apiService.get(
    `comments?entityId=${entityId}&entityType=${entityType}&limit=${limit}&page=${page}`,
  );
  return data;
};

export const createComments = async (payload: IReactions) => {
  console.log(payload);
  const data = await apiService.post('/comments', payload);
  return new Promise((res) => {
    res(data);
  });
};
