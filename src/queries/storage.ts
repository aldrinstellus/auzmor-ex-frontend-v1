import { useMutation } from '@tanstack/react-query';
import apiService from 'utils/apiService';

enum IntegrationOptions {
  Box = 'box',
  Dropbox = 'dropbox',
  GoogleDrive = 'google-drive',
  Onedrive = 'onedrive',
  Sharepoint = 'sharepoint',
}

export const useConfigureStorageMutation = () => {
  return useMutation({
    mutationKey: ['configure-storage'],
    mutationFn: async () => {
      return await apiService.post('/storage', {
        integration: IntegrationOptions.GoogleDrive,
      });
    },
  });
};
