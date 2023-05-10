import React, {
  LegacyRef,
  ReactNode,
  createContext,
  useRef,
  useState,
} from 'react';
import { DeltaStatic } from 'quill';
import { getMediaObj } from 'utils/misc';

export interface ICreatePostProviderProps {
  children?: ReactNode;
}

export enum CreatePostFlow {
  CreatePost = 'CREATE_POST',
  CreateAnnouncement = 'CREATE_ANNOUNCEMENT',
  EditMedia = 'EDIT_MEDIA',
}

export interface IAnnouncement {
  label: string;
  value: string;
}

export interface ICreatePostContext {
  activeFlow: CreatePostFlow;
  setActiveFlow: any;
  announcement: any;
  setAnnouncement: any;
  editorValue: IEditorValue;
  setEditorValue: any;
  media: IMedia[];
  files: File[];
  setFiles: (files: File[]) => void;
  setMedia: (media: IMedia[]) => void;
  inputImgRef: React.RefObject<HTMLInputElement> | null;
  inputVideoRef: React.RefObject<HTMLInputElement> | null;
  setUploads: (uploads: File[]) => void;
  replaceMedia: (index: number, data: File) => void;
  removeMedia: (index: number, callback?: () => void) => void;
  clearPostContext: () => void;
  removeAllMedia: () => void;
  isPreviewRemoved: boolean;
  setIsPreviewRemoved: (flag: boolean) => void;
  isCharLimit: boolean;
  setIsCharLimit: (flag: boolean) => void;
}

export interface IEditorValue {
  text: string;
  html: string;
  json: DeltaStatic;
}

export interface IMedia {
  altText: string;
  blurhash: string;
  contentType: string; //'image/png'
  id: string;
  isDeleted: boolean;
  isPublic: boolean;
  name: string;
  originalUrl: string;
  size: string;
  thumbnailUrl: string;
  type: 'IMAGE' | 'VIDEO';
}

export const CreatePostContext = createContext<ICreatePostContext>({
  activeFlow: CreatePostFlow.CreatePost,
  setActiveFlow: () => {},
  announcement: null,
  setAnnouncement: () => {},
  editorValue: { html: '', json: {} as DeltaStatic, text: '' },
  setEditorValue: () => {},
  media: [],
  setMedia: () => {},
  files: [],
  setFiles: () => {},
  inputImgRef: null,
  inputVideoRef: null,
  setUploads: () => {},
  replaceMedia: () => {},
  removeMedia: () => {},
  clearPostContext: () => {},
  removeAllMedia: () => {},
  isPreviewRemoved: false,
  setIsPreviewRemoved: () => {},
  isCharLimit: false,
  setIsCharLimit: () => {},
});

const CreatePostProvider: React.FC<ICreatePostProviderProps> = ({
  children,
}) => {
  const [activeFlow, setActiveFlow] = useState(CreatePostFlow.CreatePost);
  const [announcement, setAnnouncement] = useState<null | IAnnouncement>(null);
  const [editorValue, setEditorValue] = useState<IEditorValue>({
    html: '',
    json: {} as DeltaStatic,
    text: '',
  });
  const [media, setMedia] = useState<IMedia[]>([]);
  const inputImgRef = useRef<HTMLInputElement>(null);
  const inputVideoRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isPreviewRemoved, setIsPreviewRemoved] = useState<boolean>(false);
  const [isCharLimit, setIsCharLimit] = useState<boolean>(false);

  const setUploads = (uploads: File[]) => {
    setMedia([...media, ...getMediaObj(uploads)]);
    setFiles([...files, ...uploads]);
  };

  const replaceMedia = (index: number, data: File) => {
    // Replace Files
    if (files.findIndex((file: File) => file.name === media[index].name) > -1) {
      setFiles(
        files.map((file: File) =>
          file.name === media[index].name ? data : file,
        ),
      );
    } else {
      setFiles([...files, data]);
    }

    // Replace Media
    setMedia(
      media.map((eachMedia: IMedia, idx: number) =>
        idx === index ? getMediaObj([data])[0] : eachMedia,
      ),
    );
  };

  const removeMedia = (index: number, callback?: () => void) => {
    const fileName = media[index].name;
    setMedia([...media.filter((file: IMedia) => file.name !== fileName)]);
    setFiles([...files.filter((file: File) => file.name !== fileName)]);
    callback && callback();
  };

  const removeAllMedia = () => {
    setMedia([]);
    setFiles([]);
  };

  const clearPostContext = () => {
    setMedia([]);
    setAnnouncement(null);
    setEditorValue({
      html: '',
      json: {} as DeltaStatic,
      text: '',
    });
    setFiles([]);
    setActiveFlow(CreatePostFlow.CreatePost);
    setIsPreviewRemoved(false);
    setIsCharLimit(false);
  };
  return (
    <CreatePostContext.Provider
      value={{
        activeFlow,
        setActiveFlow,
        announcement,
        setAnnouncement,
        editorValue,
        setEditorValue,
        media,
        setMedia,
        files,
        setFiles,
        setUploads,
        inputImgRef,
        inputVideoRef,
        replaceMedia,
        removeMedia,
        clearPostContext,
        removeAllMedia,
        isPreviewRemoved,
        setIsPreviewRemoved,
        isCharLimit,
        setIsCharLimit,
      }}
    >
      {children}
    </CreatePostContext.Provider>
  );
};

export default CreatePostProvider;
