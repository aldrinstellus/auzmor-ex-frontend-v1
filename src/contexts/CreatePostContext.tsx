import React, { ReactNode, createContext, useState } from 'react';

export interface ICreatePostProviderProps {
  children?: ReactNode;
}

export enum CreatePostFlow {
  CreatePost = 'CREATE_POST',
  CreateAnnouncement = 'CREATE_ANNOUNCEMENT',
}

export interface IAnnouncement {
  label: string;
  value: string;
}

interface ICreatePostContext {
  activeFlow: CreatePostFlow;
  setActiveFlow: any;
  announcement: any;
  setAnnouncement: any;
}

export const CreatePostContext = createContext<ICreatePostContext>({
  activeFlow: CreatePostFlow.CreatePost,
  setActiveFlow: () => {},
  announcement: null,
  setAnnouncement: () => {},
});

const CreatePostProvider: React.FC<ICreatePostProviderProps> = ({
  children,
}) => {
  const [activeFlow, setActiveFlow] = useState(CreatePostFlow.CreatePost);
  const [announcement, setAnnouncement] = useState<null | IAnnouncement>(null);
  return (
    <CreatePostContext.Provider
      value={{ activeFlow, setActiveFlow, announcement, setAnnouncement }}
    >
      {children}
    </CreatePostContext.Provider>
  );
};

export default CreatePostProvider;
