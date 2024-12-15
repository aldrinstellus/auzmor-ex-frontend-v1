import {
  FC,
  ReactNode,
  RefObject,
  createContext,
  useRef,
  useState,
} from 'react';
import { DeltaStatic } from 'quill';
import { getBlobUrl, getMediaObj } from 'utils/misc';
import {
  AudienceEntityType,
  IAudience,
  IGetUser,
  IMedia,
  IPoll,
  IPost,
  PostType,
} from 'interfaces';
import { useCreatePostUtilityStore } from 'stores/createPostUtilityStore';
import { useChannelStore } from 'stores/channelStore';
import { useParams } from 'react-router-dom';

export interface ICreatePostProviderProps {
  data?: IPost;
  children?: ReactNode;
}

export enum CreatePostFlow {
  CreatePost = 'CREATE_POST',
  CreateAnnouncement = 'CREATE_ANNOUNCEMENT',
  EditMedia = 'EDIT_MEDIA',
  CreatePoll = 'CREATE_POLL',
  SchedulePost = 'SCHEDULE_POST',
  Audience = 'AUDIENCE',
  CreateShoutout = 'CREATE_SHOUTOUT',
  WelcomePost = 'WELCOME_POST',
}

export interface IAnnouncement {
  label: string;
  value: string;
}

export const IMG_FILE_SIZE_LIMIT = 50; //MB
export const VIDEO_FILE_SIZE_LIMIT = 2; //GB
export const MEDIA_LIMIT = 10; // number of media can be uploaded

export interface ICreatePostContext {
  activeFlow: CreatePostFlow;
  setActiveFlow: any;
  announcement: IAnnouncement | null;
  setAnnouncement: (announcement: IAnnouncement | null) => void;
  editorValue: IEditorValue;
  setEditorValue: any;
  media: IMedia[];
  files: File[];
  setFiles: (files: File[]) => void;
  setMedia: (media: IMedia[]) => void;
  inputImgRef: RefObject<HTMLInputElement> | null;
  inputVideoRef: RefObject<HTMLInputElement> | null;
  setUploads: (uploads: File[], isCoverImage?: boolean) => void;
  replaceMedia: (index: number, data: File) => void;
  removeMedia: (index: number, callback?: () => void) => void;
  clearPostContext: () => void;
  removeAllMedia: () => void;
  previewUrl: string;
  setPreviewUrl: (url: string) => void;
  isPreviewRemoved: boolean;
  setIsPreviewRemoved: (flag: boolean) => void;
  isCharLimit: boolean;
  setIsCharLimit: (flag: boolean) => void;
  isEmpty: boolean;
  setIsEmpty: (flag: boolean) => void;
  coverImageMap: ICoverImageMap[];
  setCoverImageMap: (coverImage: ICoverImageMap[]) => void;
  updateCoverImageMap: (map: ICoverImageMap) => void;
  deleteCoverImageMap: (map: ICoverImageMap | null) => void;
  getCoverImageBlobURL: (media: IMedia) => string;
  removedCoverimageFileIds: string[];
  setRemovedCoverimageFileIds: (fileIds: string[]) => void;
  showFullscreenVideo: IMedia | false;
  setShowFullscreenVideo: (showFullscreenVideo: IMedia | false) => void;
  mediaValidationErrors: IMediaValidationError[];
  setMediaValidationErrors: (
    mediaValidationErrors: IMediaValidationError[],
  ) => void;
  mediaOpenIndex: number;
  setMediaOpenIndex: (index: number) => void;
  poll: IPoll | null;
  setPoll: (pollContext: IPoll | null) => void;
  schedule: ISchedule | null;
  setSchedule: (schedule: ISchedule | null) => void;
  audience: IAudience[] | null;
  setAudience: (audience: IAudience[] | null) => void;
  shoutoutUserIds: string[];
  setShoutoutUserIds: (ids: string[]) => void;
  shoutoutUsers: Record<string, false | IGetUser>;
  setShoutoutUsers: (users: Record<string, false | IGetUser>) => void;
  setShoutoutTemplate: (params: any) => void;
  shoutoutTemplate: any;
  postType: PostType | null;
  setPostType: (type: PostType) => void;
}

export enum MediaValidationError {
  ImageSizeExceed = 'IMAGE_SIZE_EXCEED',
  VideoSizeExceed = 'VIDEO_SIZE_EXCEED',
  MediaLengthExceed = 'MEDIA_LENGTH_EXCEED',
  FileTypeNotSupported = 'FILE_TYPE_NOT_SUPPORTED',
  IncorrectDimension = 'INCORRECT_DIMENSION',
}

export interface IMediaValidationError {
  errorType: MediaValidationError;
  errorMsg: string;
  fileName?: string;
}

export interface IEditorValue {
  text: string;
  html: string;
  editor: DeltaStatic;
}

export interface ISchedule {
  timezone: string;
  date: string;
  time: string;
}

export interface ICoverImageMap {
  videoName?: string;
  coverImageName: string;
  blobUrl?: string;
}

export const CreatePostContext = createContext<ICreatePostContext>({
  activeFlow: CreatePostFlow.CreatePost,
  setActiveFlow: () => {},
  announcement: null,
  setAnnouncement: () => {},
  editorValue: { html: '', editor: {} as DeltaStatic, text: '' },
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
  previewUrl: '',
  setPreviewUrl: () => {},
  isPreviewRemoved: false,
  setIsPreviewRemoved: () => {},
  isCharLimit: false,
  setIsCharLimit: () => {},
  isEmpty: false,
  setIsEmpty: () => {},
  coverImageMap: [],
  setCoverImageMap: () => {},
  updateCoverImageMap: () => {},
  deleteCoverImageMap: () => {},
  getCoverImageBlobURL: () => '',
  removedCoverimageFileIds: [],
  setRemovedCoverimageFileIds: () => {},
  showFullscreenVideo: false,
  setShowFullscreenVideo: () => {},
  mediaValidationErrors: [],
  setMediaValidationErrors: () => {},
  mediaOpenIndex: 0,
  setMediaOpenIndex: () => {},
  poll: null,
  setPoll: () => {},
  schedule: null,
  setSchedule: () => {},
  audience: null,
  setAudience: () => {},
  shoutoutUserIds: [],
  setShoutoutUserIds: () => {},
  shoutoutUsers: {},
  setShoutoutUsers: () => {},
  setShoutoutTemplate: () => {},
  shoutoutTemplate: {},
  postType: PostType.Update,
  setPostType: () => {},
});

const CreatePostProvider: FC<ICreatePostProviderProps> = ({
  children,
  data,
}) => {
  // Set active channel as audience if channel is exist in url
  const getChannel = useChannelStore((action) => action.getChannel);
  const { channelId } = useParams();
  let channelAudience: IAudience[] | null = null;
  if (channelId) {
    channelAudience = [
      {
        entityId: channelId,
        entityType: AudienceEntityType.Channel,
        entity: getChannel(channelId),
        name: getChannel(channelId).name,
      },
    ];
  }

  const openCreatePostWithPolls = useCreatePostUtilityStore(
    (state) => state.openCreatePostWithPolls,
  );
  const openCreatePostWithShoutout = useCreatePostUtilityStore(
    (state) => state.openCreatePostWithShoutout,
  );
  const [activeFlow, setActiveFlow] = useState(
    openCreatePostWithPolls
      ? CreatePostFlow.CreatePoll
      : openCreatePostWithShoutout
      ? CreatePostFlow.CreateShoutout
      : CreatePostFlow.CreatePost,
  );
  const [announcement, setAnnouncement] = useState<null | IAnnouncement>(null);
  const [editorValue, setEditorValue] = useState<IEditorValue>(
    data?.content || {
      html: '',
      editor: {} as DeltaStatic,
      text: '',
    },
  );
  const [media, setMedia] = useState<IMedia[]>((data?.files as IMedia[]) || []);
  const inputImgRef = useRef<HTMLInputElement>(null);
  const inputVideoRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isPreviewRemoved, setIsPreviewRemoved] = useState<boolean>(false);
  const [isCharLimit, setIsCharLimit] = useState<boolean>(false);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [coverImageMap, setCoverImageMap] = useState<ICoverImageMap[]>([]);
  const [removedCoverimageFileIds, setRemovedCoverimageFileIds] = useState<
    string[]
  >([]);
  const [showFullscreenVideo, setShowFullscreenVideo] = useState<
    IMedia | false
  >(false);
  const [mediaValidationErrors, setMediaValidationErrors] = useState<
    IMediaValidationError[]
  >([]);
  const [mediaOpenIndex, setMediaOpenIndex] = useState<number>(-1);
  const [poll, setPoll] = useState<IPoll | null>(null);
  const [schedule, setSchedule] = useState<ISchedule | null>(null);
  const [audience, setAudience] = useState<IAudience[] | null>(
    data?.audience.filter(
      (audience: any) => audience?.entityType !== AudienceEntityType.User,
    ) ||
      channelAudience ||
      null,
  );
  const [shoutoutUserIds, setShoutoutUserIds] = useState<string[]>([]);
  const [shoutoutUsers, setShoutoutUsers] = useState<any>({});
  const [shoutoutTemplate, setShoutoutTemplate] = useState<any>({});
  const [postType, setPostType] = useState<PostType>(
    data?.type || PostType.Update,
  );

  const setUploads = (uploads: File[], isCoverImage?: boolean) => {
    if (!isCoverImage) {
      setMedia((prevMedia) => [...prevMedia, ...getMediaObj(uploads)]);
    }
    setFiles((prevFiles) => [...prevFiles, ...uploads]);
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
    const coverImageName = coverImageMap.find(
      (eachmap: ICoverImageMap) => eachmap.videoName === fileName,
    )?.coverImageName;

    //Update files
    setFiles([
      ...files.filter(
        (file: File) =>
          file.name !== fileName ||
          (coverImageName && file.name !== coverImageName),
      ),
    ]);

    // update media
    const updatedMedia = media.map((media: IMedia) => {
      if (media.name === fileName) {
        if (media.id !== '') {
          setRemovedCoverimageFileIds([...removedCoverimageFileIds, media.id]);
        }
        return { ...media, coverImage: null };
      } else {
        return media;
      }
    });
    setMedia([
      ...updatedMedia.filter((file: IMedia) => file.name !== fileName),
    ]);

    // update cover image
    setCoverImageMap(
      coverImageMap.filter(
        (eachmap: ICoverImageMap) => eachmap.videoName !== fileName,
      ),
    );

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
      editor: {} as DeltaStatic,
      text: '',
    });
    setFiles([]);
    setActiveFlow(CreatePostFlow.CreatePost);
    setIsPreviewRemoved(false);
    setPreviewUrl('');
    setIsCharLimit(false);
    setIsEmpty(true);
    setCoverImageMap([]);
    setRemovedCoverimageFileIds([]);
    setShowFullscreenVideo(false);
    setMediaValidationErrors([]);
    setPoll(null);
    setSchedule(null);
    setAudience(null);
    setShoutoutUserIds([]);
    setShoutoutUsers({});
    setShoutoutTemplate({});
    setPostType(PostType.Update);
  };

  const updateCoverImageMap = (map: ICoverImageMap) => {
    if (
      coverImageMap.some(
        (value: ICoverImageMap) => value.videoName === map.videoName,
      )
    ) {
      setCoverImageMap(
        coverImageMap.map((value: ICoverImageMap) => {
          if (map.videoName === value.videoName) {
            return {
              videoName: map.videoName,
              coverImageName: map.coverImageName,
            };
          } else {
            return value;
          }
        }),
      );
    } else {
      setCoverImageMap([...coverImageMap, map]);
    }
    setRemovedCoverimageFileIds([
      ...removedCoverimageFileIds.filter(
        (fileId: string) =>
          fileId !== media.find((media) => media.name === map.videoName)?.id,
      ),
    ]);
  };

  const deleteCoverImageMap = (map: ICoverImageMap | null) => {
    if (!map) return;
    setCoverImageMap(
      coverImageMap.filter(
        (eachmap: ICoverImageMap) => eachmap.videoName !== map.videoName,
      ),
    );
    setFiles([
      ...files.filter((file: File) => file.name !== map.coverImageName),
    ]);

    const updatedMedia = media.map((media: IMedia) => {
      if (media.name === map.videoName) {
        if (media.id !== '') {
          setRemovedCoverimageFileIds([...removedCoverimageFileIds, media.id]);
        }
        return { ...media, coverImage: null };
      } else {
        return media;
      }
    });
    setMedia([...updatedMedia]);
  };

  const getCoverImageBlobURL = (media: IMedia) => {
    const coverImageName = coverImageMap.find(
      (map) => map.videoName === media.name,
    )?.coverImageName;
    if (coverImageName) {
      const file = files.find((file) => file.name === coverImageName);
      if (file) {
        return getBlobUrl(file);
      } else {
        return '';
      }
    } else {
      return media.coverImage?.original || '';
    }
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
        previewUrl,
        setPreviewUrl,
        isPreviewRemoved,
        setIsPreviewRemoved,
        isCharLimit,
        setIsCharLimit,
        isEmpty,
        setIsEmpty,
        coverImageMap,
        setCoverImageMap,
        updateCoverImageMap,
        deleteCoverImageMap,
        getCoverImageBlobURL,
        removedCoverimageFileIds,
        setRemovedCoverimageFileIds,
        showFullscreenVideo,
        setShowFullscreenVideo,
        mediaValidationErrors,
        setMediaValidationErrors,
        mediaOpenIndex,
        setMediaOpenIndex,
        poll,
        setPoll,
        schedule,
        setSchedule,
        audience,
        setAudience,
        shoutoutUserIds,
        setShoutoutUserIds,
        shoutoutUsers,
        setShoutoutUsers,
        setShoutoutTemplate,
        shoutoutTemplate,
        postType,
        setPostType,
      }}
    >
      {children}
    </CreatePostContext.Provider>
  );
};

export default CreatePostProvider;
