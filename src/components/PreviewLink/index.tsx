import React, { useMemo } from 'react';
import { usePreviewLink } from 'queries/post';
import ImagePreview from './components/ImagePreview';
import IconPreview from './components/IconPreview';

export type LinkMetadataProps = {
  title?: string;
  image?: string;
  description?: string;
  favicon?: string;
  url?: string;
  themeColor?: string;
};

export type PreviewLinkProps = {
  previewUrl?: string;
  setPreviewUrl?: (previewUrl: string) => void;
  setIsPreviewRemove?: (isPreviewRemove: boolean) => void;
  linkMetadata?: LinkMetadataProps;
};

const PreviewLink: React.FC<PreviewLinkProps> = ({
  previewUrl,
  setPreviewUrl,
  setIsPreviewRemove,
  linkMetadata,
}) => {
  let data: LinkMetadataProps,
    isLoading = false;

  if (linkMetadata !== null) {
    data = linkMetadata as LinkMetadataProps;
  } else {
    const previewLinkData = usePreviewLink(previewUrl as string);
    data = previewLinkData?.data as LinkMetadataProps;
    isLoading = previewLinkData?.isLoading;
  }

  const preview = useMemo(() => {
    if (data?.image) {
      return (
        <ImagePreview
          metaData={data}
          setPreviewUrl={setPreviewUrl}
          setIsPreviewRemove={setIsPreviewRemove}
          showClose={linkMetadata === null}
        />
      );
    } else if (data?.favicon) {
      return (
        <IconPreview
          metaData={data}
          setPreviewUrl={setPreviewUrl}
          setIsPreviewRemove={setIsPreviewRemove}
          showClose={linkMetadata === null}
        />
      );
    } else if (isLoading) {
      return (
        <div className="flex justify-center items-center mb-14">
          <div className="text-neutral-900 text-xs font-normal">
            Loading Preview
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  }, [data, isLoading]);

  return (
    <div className="w-full">
      {previewUrl || linkMetadata ? <div>{preview}</div> : null}
    </div>
  );
};

export default PreviewLink;
