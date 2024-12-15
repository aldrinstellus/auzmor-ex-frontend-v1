import { useQuery } from '@tanstack/react-query';
import apiService from 'utils/apiService';
import { isValidUrl } from 'utils/misc';

export const getPreviewLink = async (previewUrl: string) => {
  if (!previewUrl) {
    return null;
  }
  const { data } = await apiService.get(`/links/unfurl?url=${previewUrl}`);
  return data;
};

export const usePreviewLink = (previewUrl: string) => {
  return useQuery({
    queryKey: ['preview-link', previewUrl],
    queryFn: () => getPreviewLink(previewUrl),
    staleTime: Infinity,
    enabled: isValidUrl(previewUrl),
  });
};
