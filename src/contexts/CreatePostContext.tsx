import React, { ReactNode, createContext, useRef, useState } from 'react';
import { DeltaStatic } from 'quill';

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

export interface ICreatePostContext {
  activeFlow: CreatePostFlow;
  setActiveFlow: any;
  announcement: any;
  setAnnouncement: any;
  editorValue: IEditorValue;
  setEditorValue: any;
}

export interface IEditorValue {
  text: string;
  html: string;
  json: DeltaStatic;
}

export const CreatePostContext = createContext<ICreatePostContext>({
  activeFlow: CreatePostFlow.CreatePost,
  setActiveFlow: () => {},
  announcement: null,
  setAnnouncement: () => {},
  editorValue: { html: '', json: {} as DeltaStatic, text: '' },
  setEditorValue: () => {},
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
  const quillRef = useRef(null);
  return (
    <CreatePostContext.Provider
      value={{
        activeFlow,
        setActiveFlow,
        announcement,
        setAnnouncement,
        editorValue,
        setEditorValue,
      }}
    >
      {children}
    </CreatePostContext.Provider>
  );
};

export default CreatePostProvider;
