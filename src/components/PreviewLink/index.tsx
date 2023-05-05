import React, { useMemo } from 'react';
import { usePreviewLink } from 'queries/post';
import ImagePreview from './components/ImagePreview';
import IconPreview from './components/IconPreview';
import { useDebounce } from 'hooks/useDebounce';

export type PreviewLinkProps = {
  previewUrl: string;
  setPreviewUrl: (previewUrl: string) => void;
  setIsPreviewRemove: (isPreviewRemove: boolean) => void;
};

const PreviewLink: React.FC<PreviewLinkProps> = ({
  previewUrl,
  setPreviewUrl,
  setIsPreviewRemove,
}) => {
  const debouncePreviewUrl = useDebounce(previewUrl, 1000);
  const { data, isLoading, isError } = usePreviewLink(debouncePreviewUrl);
  const preview = useMemo(() => {
    if (data?.image) {
      return (
        <ImagePreview
          metaData={data}
          setPreviewUrl={setPreviewUrl}
          setIsPreviewRemove={setIsPreviewRemove}
        />
      );
    } else if (data?.favicon) {
      return (
        <IconPreview
          metaData={data}
          setPreviewUrl={setPreviewUrl}
          setIsPreviewRemove={setIsPreviewRemove}
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
      return (
        <div>
          {isError ? (
            <div className="text-red-600 m-5">
              Cannot display preview. try valid link
            </div>
          ) : null}
        </div>
      );
    }
  }, [data, isLoading, isError]);

  return <div>{previewUrl ? <div>{preview}</div> : null}</div>;
};

export default PreviewLink;
