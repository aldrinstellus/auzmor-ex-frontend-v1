import apiService from 'utils/apiService';

interface IReactions {
  entityId: string;
  entityType: string;
  type?: string;
}
interface IDelete {
  entityId: string;
  entityType: string;
  id: string;
}

export const createReaction = async (payload: IReactions) => {
  console.log(payload);
  const { data } = await apiService.post('/reactions', payload);
  return data;
};

export const getReactions = async (payload: IReactions) => {
  const { entityId, entityType } = payload;

  const { data } = await apiService.get(
    `reactions?entityId=${entityId}&entityType=${entityType}`,
  );
  return data;
};

export const deleteReaction = async (payload: IDelete) => {
  const { entityId, entityType, id } = payload;

  await apiService.delete(
    `/reactions/${id}?entityId=${entityId}&entityType=${entityType}`,
    {},
  );
};

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
