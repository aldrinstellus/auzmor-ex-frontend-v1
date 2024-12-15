import { QueryFunctionContext, useInfiniteQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

export const getAllCategory = async ({
  pageParam = 1,
  queryKey,
}: QueryFunctionContext<(Record<string, any> | undefined | string)[], any>) => {
  const query: any = queryKey[1];
  const response = await apiService.get('/categories', {
    ...query,
    page: pageParam,
  });
  const { data } = response;

  const transformedData = data?.result?.data?.map((item: any) => ({
    name: item.title,
    type: 'APP',
    id: item.id,
  }));

  return {
    data: {
      result: {
        data: transformedData,
      },
      nextPage: pageParam + 1,
    },
  };
};

export const useInfiniteLearnCategory = (query?: Record<string, any>) => {
  return useInfiniteQuery({
    queryKey: ['learnCategory', query],
    queryFn: getAllCategory,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage?.data?.result?.data?.length === 0) {
        return undefined; // No more data to fetch
      }
      const currentPage = pages.length;
      return currentPage + 1; // Next page number
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const createCategory = async (payload: any) => {
  const data = await apiService.post('categories', payload);
  return data;
};
