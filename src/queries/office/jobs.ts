import apiService from 'utils/apiService';

export enum JobTypesEnum {
  UserImport = 'USERS_IMPORT',
  FileMetaParsingAndValidation = 'FILE_META_PARSING_AND_VALIDATION',
  BulkDataInsertionAndValidation = 'BULK_DATA_INSERTION_AND_VALIDATION',
  UserCreation = 'USER_CREATION',
}

export enum JobStatusEnum {
  Todo = 'TODO',
  Active = 'ACTIVE',
  Processing = 'PROCESSING',
  Completed = 'COMPLETED',
}

export const createNewJob = async (payload: Record<string, any>) => {
  const { data } = await apiService.post('/jobs', payload);
  return data;
};

export const getJobs = async () => {
  const { data } = await apiService.get('/jobs');
  return data;
};

export const getJob = async (jobId: string) => {
  const { data } = await apiService.get(`/jobs/${jobId}`);
  return data;
};

export const getJobStep = async (
  jobId: string,
  payload: Record<string, any>,
) => {
  const { data } = await apiService.get(`/jobs/${jobId}/steps`, payload);
  return data;
};

export const startJobStep = async (
  jobId: string,
  payload: Record<string, any>,
) => {
  const { data } = await apiService.post(`/jobs/${jobId}/steps`, payload);
  return data;
};
