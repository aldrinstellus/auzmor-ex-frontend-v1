import { useQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';

const getAllPeople = async (q: Record<string, any>) => {};

export const usePeople: any = (q: Record<string, any>) => {
  // check the signature
  return useQuery(['people', q], () => getAllPeople(q), {
    staleTime: 60 * 10000,
  });
};
