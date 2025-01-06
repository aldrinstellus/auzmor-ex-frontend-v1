/* eslint-disable @typescript-eslint/no-unused-vars */
import apiService from 'utils/apiService';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getType } from 'utils/misc';
import { IMedia, EntityType } from 'interfaces';
import {
  BackgroundJobStatusEnum,
  useBackgroundJobStore,
} from 'stores/backgroundJobStore';
import Icon from 'components/Icon';

export enum UploadStatus {
  YetToStart = 'YET_TO_START',
  Uploading = 'UPLOADING',
  Finished = 'FINISHED',
  Error = 'ERROR',
}

interface ICreateFileResponse {
  accessToken: string;
  altText: string;
  audience: Record<string, any>;
  blurhash: string;
  contentType: string;
  createdAt: string;
  createdBy: string;
  entityId: string;
  entityType: string;
  flatpath: string;
  id: string;
  isPublic: boolean;
  name: string;
  size: string;
  type: string;
  uploadId: string;
  uploadUrl: string;
}

interface IETag {
  partnumber: number;
  etag: string;
}

interface IUploadToGcpResposne {
  id?: string;
  etags?: IETag[];
}

export interface IFile {
  name: string;
  contentType: string;
  type: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  altText: 'no image';
  size: string;
  audience: any;
}

export const useUpload = () => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(
    UploadStatus.YetToStart,
  );
  const [error, setError] = useState('');
  const chunksize = 1048576 * 8; // 8 MB

  const createFile = async (payload: IFile, entityType: EntityType) =>
    await apiService.post(`/files?entityType=${entityType}`, payload);

  const uploadToGCP = async (res: ICreateFileResponse, file: File) => {
    const promises = [];
    const totalPartsCount =
      parseInt(res.size) % chunksize === 0
        ? parseInt(res.size) / chunksize
        : Math.floor(parseInt(res.size) / chunksize) + 1;
    for (let i = 0; i < totalPartsCount; i++) {
      promises.push(
        axios.put(
          `${res.uploadUrl}?partNumber=${i + 1}&uploadId=${res.uploadId}`,
          getChunk(i + 1, file),
          { headers: { authorization: `Bearer ${res.accessToken}` } },
        ),
      );
    }
    if (promises.length > 0) {
      const promiseResponse = await Promise.allSettled(promises);
      const eTags: { partnumber: any; etag: any }[] = [];
      promiseResponse.forEach((eachPromise) => {
        if (eachPromise.status === 'fulfilled') {
          const partnumber = parseInt(
            (
              new URL((eachPromise as any).value.config.url) as any
            ).searchParams.get('partNumber'),
          ) as any;
          const etag = (eachPromise as any).value.headers.etag;
          eTags.push({ partnumber, etag: etag.replaceAll('"', '').toString() });
        }
      });
      return { id: res.id, etags: eTags } as IUploadToGcpResposne;
    }
  };

  const postETags = async (
    id?: string,
    etags?: IETag[],
    coverImageUrl?: string,
  ) => await apiService.patch(`/files/${id}`, { etags: etags, coverImageUrl });

  function getChunk(partNumber: number, file: any) {
    const beginchunk = (partNumber - 1) * chunksize;
    let endchunk = partNumber * chunksize;

    if (endchunk > file.size) {
      endchunk = file.size;
    }

    return file.slice(beginchunk, endchunk);
  }
  const uploadMedia = async (fileList: File[], entityType: EntityType) => {
    // TODO Add error state when upload fails.
    const uploadedFiles: IMedia[] = [];
    const createFilePromises: Promise<ICreateFileResponse>[] = [];
    const uploadToGCPPromises: Promise<IUploadToGcpResposne | undefined>[] = [];
    const uploadETagPromises: Promise<any>[] = [];
    setUploadStatus(UploadStatus.Uploading);
    const files: IFile[] = [];
    fileList.forEach((file: File) => {
      files.push({
        name: file?.name,
        contentType: file?.type,
        type: getType(file.type),
        size: file?.size.toString(),
        altText: 'no image',
        audience: [],
      });
    });
    files.forEach((file: IFile, _index: number) => {
      createFilePromises.push(createFile(file, entityType));
    });

    if (createFilePromises.length > 0) {
      const promisesRes = await Promise.allSettled(createFilePromises);
      promisesRes.forEach(
        (promiseRes: PromiseSettledResult<ICreateFileResponse>) => {
          if (promiseRes.status === 'fulfilled') {
            // console.log('uploading to gcp...');
            // console.log((promiseRes.value as any).result.data);
            uploadToGCPPromises.push(
              uploadToGCP(
                (promiseRes.value as any).result.data as ICreateFileResponse,
                fileList.find(
                  (file: File) =>
                    file.name === (promiseRes.value as any).result.data.name,
                )!,
              ),
            );
            setError('');
          } else {
            const reason =
              promiseRes?.reason?.response?.data?.errors?.[0]?.message ||
              'Something went wrong';
            if (reason.includes('File type')) {
              setError('File type not supported. Upload a supported file type');
            } else {
              setError(
                promiseRes?.reason?.response?.data?.errors?.[0]?.message ||
                  'Something went wrong',
              );
            }

            console.log('create file failed');
            // setUploadStatus(UploadStatus.Error);
          }
        },
      );
    } else {
      setUploadStatus(UploadStatus.Finished);
      return uploadedFiles;
    }

    if (uploadToGCPPromises.length > 0) {
      const promisesRes = await Promise.allSettled(uploadToGCPPromises);
      promisesRes.forEach(
        (
          promiseRes: PromiseSettledResult<IUploadToGcpResposne | undefined>,
        ) => {
          if (promiseRes.status === 'fulfilled') {
            // console.log('uploading etags...');
            uploadETagPromises.push(
              postETags(promiseRes.value?.id, promiseRes.value?.etags),
            );
          } else {
            console.log(promiseRes);
            console.log('upload to gcp faild');
          }
        },
      );
    } else {
      if (uploadStatus !== UploadStatus.Error) {
        setUploadStatus(UploadStatus.Finished);
      }
      return uploadedFiles;
    }

    if (uploadETagPromises.length > 0) {
      const promisesRes = await Promise.allSettled(uploadETagPromises);
      promisesRes.forEach((promiseRes: PromiseSettledResult<IMedia>) => {
        if (promiseRes.status === 'fulfilled') {
          uploadedFiles.push((promiseRes.value as any).result.data);
        } else {
          console.log(promiseRes);
          console.log('etag upload failed');
        }
      });
    }
    setUploadStatus(UploadStatus.Finished);
    return uploadedFiles;
  };

  const useUploadCoverImage = async (
    mappings: { fileId: string; coverImageUrl: string }[],
  ) => {
    setUploadStatus(UploadStatus.Uploading);
    const updateFilePromises: Promise<any>[] = [];
    mappings.forEach((mapping) => {
      updateFilePromises.push(
        postETags(mapping.fileId, [], mapping.coverImageUrl),
      );
    });
    if (updateFilePromises.length > 0) {
      const promisesRes = await Promise.allSettled(updateFilePromises);
      promisesRes.forEach((promiseRes: PromiseSettledResult<IMedia>) => {
        if (promiseRes.status === 'fulfilled') {
          console.log(promiseRes, 'Upload cover image response');
        } else {
          console.log(promiseRes);
          console.log('upload cover image failed');
        }
      });
    }
    setUploadStatus(UploadStatus.Finished);
  };

  const removeCoverImage = async (fileIds: string[]) => {
    setUploadStatus(UploadStatus.Uploading);
    const updateFilePromises: Promise<any>[] = [];
    fileIds.forEach((fileId) => {
      updateFilePromises.push(postETags(fileId, [], ''));
    });
    if (updateFilePromises.length > 0) {
      const promisesRes = await Promise.allSettled(updateFilePromises);
      promisesRes.forEach((promiseRes: PromiseSettledResult<IMedia>) => {
        if (promiseRes.status === 'fulfilled') {
          console.log(promiseRes, 'Remove cover image response');
        } else {
          console.log(promiseRes);
          console.log('Remove cover image failed');
        }
      });
    }
    setUploadStatus(UploadStatus.Finished);
  };

  return {
    error,
    uploadMedia,
    uploadStatus,
    useUploadCoverImage,
    removeCoverImage,
  };
};

export interface IUploadUrlPayload {
  fileName: string;
  parentFolderId: string;
  rootFolderId: string;
}
export interface IUploadUrlResponse {
  status: string;
  name: string;
  uploadURL: string;
}

export const useChannelDocUpload = (channelId: string) => {
  const { getJob, setShow, updateJobProgress, updateJob } =
    useBackgroundJobStore();

  const getUploadUrl = async (payload: IUploadUrlPayload) =>
    await apiService.get(`/channels/${channelId}/file/uploadUrl`, payload);

  const uploadToSharepoint = async (
    res: IUploadUrlResponse,
    file: File,
    jobId: string,
  ) => {
    try {
      const uploadUrl = res.uploadURL;
      const chunkSize = 5 * 1024 * 1024; // 5 MB
      const totalBytes = file.size;
      let offset = 0;
      let lastResponse = null;
      const totalSteps = Math.floor(totalBytes / chunkSize);
      while (offset < totalBytes) {
        const completedsteps = Math.floor(offset / chunkSize);
        const chunk = file.slice(offset, offset + chunkSize);
        const startByte = offset;
        const endByte = offset + chunk.size - 1;

        const headers = {
          'Content-Range': `bytes ${startByte}-${endByte}/${totalBytes}`,
        };

        const response = await fetch(uploadUrl, {
          method: 'PUT',
          headers,
          body: chunk,
        });
        lastResponse = await response.json();
        offset += chunk.size;
        updateJobProgress(
          jobId,
          Math.round((completedsteps * 100) / totalSteps),
        );
      }
      return lastResponse;
    } catch (e) {
      throw e;
    }
  };

  const finishUpload = async (payload: {
    fileName: string;
    etag: string;
    id: string;
    ownerName: string;
    externalModifiedBy: string;
    externalCreatedAt: string;
    externalUpdatedAt: string;
    externalParentId: string;
    externalUrl: string;
    mimeType: string;
    size: number;
    rootFolderId: string;
  }) => {
    apiService.post(`/channels/${channelId}/file/upload`, payload);
  };

  const uploadMedia = async (
    fileList: { rootFolderId: string; parentFolderId: string; file: File }[],
  ) => {
    setShow(true);
    const uploadedFiles: IMedia[] = [];
    const files: IUploadUrlPayload[] = [];
    fileList.forEach(({ file, parentFolderId, rootFolderId }) => {
      files.push({
        fileName: file?.name,
        parentFolderId,
        rootFolderId,
      });
    });
    files.forEach((file: IUploadUrlPayload, index: number) => {
      const jobId = `upload-job-${index}`;
      const job = getJob(jobId);
      if (!!job && job.status === BackgroundJobStatusEnum.YetToStart) {
        try {
          getUploadUrl(file)
            .then((response) => {
              updateJobProgress(jobId, 0, BackgroundJobStatusEnum.Running);
              uploadToSharepoint(
                (response as any).data.result as IUploadUrlResponse,
                fileList.find(
                  ({ file }) =>
                    file.name === (response as any).data.result.name,
                )!.file,
                jobId,
              ).then((response) => {
                updateJobProgress(
                  jobId,
                  100,
                  BackgroundJobStatusEnum.CompletedSuccessfully,
                );
                finishUpload({
                  fileName: response?.name,
                  etag: response?.eTag.match(/\{([A-F0-9\-]+)\}/)[1],
                  id: response?.id,
                  ownerName: response?.createdBy?.user?.displayName,
                  externalModifiedBy:
                    response?.lastModifiedBy?.user?.displayName,
                  externalCreatedAt: response?.createdDateTime,
                  externalUpdatedAt: response?.lastModifiedDateTime,
                  externalParentId: response?.parentReference?.id,
                  externalUrl: response?.webUrl,
                  mimeType: response?.file?.mimeType,
                  size: response?.size,
                  rootFolderId: file.rootFolderId,
                }).then(() => {
                  updateJobProgress(
                    jobId,
                    100,
                    BackgroundJobStatusEnum.CompletedSuccessfully,
                  );
                });
              });
            })
            .catch((e) => {
              updateJob({
                ...job,
                progress: 100,
                status: BackgroundJobStatusEnum.Error,
                jobComment: 'Upload failed',
              });
              console.log(e);
            });
        } catch (e) {
          updateJob({
            ...job,
            progress: 100,
            status: BackgroundJobStatusEnum.Error,
            jobComment: 'Upload failed',
          });
          console.log(e);
        }
      }
    });

    return uploadedFiles;
  };

  return {
    uploadMedia,
  };
};
