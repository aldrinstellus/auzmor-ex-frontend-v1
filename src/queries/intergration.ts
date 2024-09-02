import apiService from 'utils/apiService';

// const createConfiguration = async ({
//   name,
// }): () => {
//     return await apiService.get('/categories', queryKey[1]);
// };

export const createConfiguration = async (name: string) => {
  const { result } = await apiService.post('/hris/configure', { name });
  return result.data;
};
// export const useInfiniteCategories = (q?: Record<string, any>) => {
//   return useInfiniteQuery({
//     queryKey: ['categories', q],
//     queryFn: getAllCategories,
//     getNextPageParam: (lastPage: any) => {
//       const pageDataLen = lastPage?.data?.result?.data?.length;
//       const pageLimit = lastPage?.data?.result?.paging?.limit;
//       if (pageDataLen < pageLimit) {
//         return null;
//       }
//       return lastPage?.data?.result?.paging?.next;
//     },
//     getPreviousPageParam: (currentPage: any) => {
//       return currentPage?.data?.result?.paging?.prev;
//     },
//     staleTime: 5 * 60 * 1000,
//   });
// };
