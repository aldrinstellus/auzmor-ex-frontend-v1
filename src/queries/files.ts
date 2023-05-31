import apiService from 'utils/apiService';
import axios from 'axios';
import { useState } from 'react';
import { getType } from 'utils/misc';
import { IMedia } from 'contexts/CreatePostContext';

export const validImageTypes = ['image/png', 'image/jpg', 'image/jpeg'];

export interface IFile {
  name: string;
  contentType: string;
  type: 'IMAGE' | 'VIDEO';
  altText: 'no image';
  size: string;
  audience: {
    users: [];
    teams: [];
    channels: [];
  };
}

export enum EntityType {
  Post = 'POST',
  Comment = 'COMMENT',
  UserProfileImage = 'USER_PROFILE_IMAGE',
  UserCoverImage = 'USER_COVER_IMAGE',
  OrgLogo = 'ORG_LOGO',
  OrgBanner = 'ORG_BANNER',
  OrgFavicon = 'ORG_FAVICON',
  OrgLoginVideo = 'ORG_LOGIN_VIDEO',
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

export enum UploadStatus {
  YetToStart = 'YET_TO_START',
  Uploading = 'UPLOADING',
  Finished = 'FINISHED',
  Error = 'ERROR',
}

export const useUpload = () => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>(
    UploadStatus.YetToStart,
  );
  const chunksize = 1048576 * 8; // 8 MB

  const createFile = async (payload: IFile, entityType: EntityType) =>
    await apiService.post(`/files?entityType=${entityType}`, payload);

  const uploadToGCP = async (res: ICreateFileResponse, file: File) => {
    const promises = [];
    const totalPartsCount =
      parseInt(res.size) % chunksize === 0
        ? parseInt(res.size) / chunksize
        : Math.floor(parseInt(res.size) / chunksize) + 1;
    const remainingparts = [1];
    for (let i = 0; i < remainingparts.length; i++) {
      const partnumber = remainingparts[i];
      promises.push(
        axios.put(
          `${res.uploadUrl}?partNumber=${partnumber}&uploadId=${res.uploadId}`,
          getChunk(partnumber, file),
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
        audience: {
          users: [],
          teams: [],
          channels: [],
        },
      });
    });
    files.forEach((file: IFile, index: number) => {
      createFilePromises.push(createFile(file, entityType));
    });

    if (createFilePromises.length > 0) {
      const promisesRes = await Promise.allSettled(createFilePromises);
      promisesRes.forEach(
        (promiseRes: PromiseSettledResult<ICreateFileResponse>) => {
          if (promiseRes.status === 'fulfilled') {
            console.log('uploading to gcp...');
            console.log((promiseRes.value as any).result.data);
            uploadToGCPPromises.push(
              uploadToGCP(
                (promiseRes.value as any).result.data as ICreateFileResponse,
                fileList.find(
                  (file: File) =>
                    file.name === (promiseRes.value as any).result.data.name,
                )!,
              ),
            );
          } else {
            console.log(promiseRes);
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
            console.log('uploading etags...');
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
          console.log(promiseRes, 'Rmove cover image response');
        } else {
          console.log(promiseRes);
          console.log('Remove cover image failed');
        }
      });
    }
    setUploadStatus(UploadStatus.Finished);
  };

  return { uploadMedia, uploadStatus, useUploadCoverImage, removeCoverImage };
};
