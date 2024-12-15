import { IMediaValidationError } from 'contexts/CreatePostContext';
import { IMedia } from 'interfaces';
import { useRef, useState } from 'react';
import { getMediaObj } from 'utils/misc';

export const useUploadState = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mediaValidationErrors, setMediaValidationErrors] = useState<
    IMediaValidationError[]
  >([]);
  const [media, setMedia] = useState<IMedia[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const setUploads = (uploads: File[]) => {
    setMedia([...getMediaObj(uploads)]);
    setFiles([...uploads]);
  };

  return {
    inputRef,
    mediaValidationErrors,
    setMediaValidationErrors,
    media,
    setMedia,
    files,
    setFiles,
    setUploads,
  };
};
