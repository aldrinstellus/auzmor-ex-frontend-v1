import { useQuery } from '@tanstack/react-query';
import { dummyFolders } from 'mocks/documents';
import apiService from 'utils/apiService';

const getDirectories = async (q: { channelId: string; q?: string }) => {
  return await apiService
    .get(`/channel/${q.channelId}/directories`, {
      q: q.q,
    })
    .catch((_e) => {
      return dummyFolders;
    });
};

export const updateConnection = async (q: {
  channelId: string;
  folderId: string;
  name: string;
  orgProviderId: string;
}) => {
  return await apiService.put(`/channels/${q.channelId}/connect`, {
    folderId: q.folderId,
    name: q.name,
    orgProviderId: q.orgProviderId,
  });
};

export const useDirectories = (q: { channelId: string; q?: string }) => {
  return useQuery({
    queryKey: ['get-directories', q],
    queryFn: () => getDirectories(q),
  });
};
