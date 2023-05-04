import React, { useMemo } from 'react';
import { usePreviewLink } from 'queries/post';
import ImagePreview from './components/ImagePreview';
import IconPreview from './components/IconPreview';

export type PreviewLinkProps = {
  previewUrl: string;
  setPreviewUrl: (previewUrl: string) => void;
};

const PreviewLink: React.FC<PreviewLinkProps> = ({
  previewUrl,
  setPreviewUrl,
}) => {
  const { data, isLoading } = usePreviewLink(previewUrl);
  const preview = useMemo(() => {
    if (data?.open_graph?.images && data?.open_graph?.images.length > 0) {
      return <ImagePreview metaData={data} setPreviewUrl={setPreviewUrl} />;
    } else if (data?.favicon) {
      return <IconPreview metaData={data} setPreviewUrl={setPreviewUrl} />;
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

  return <div>{previewUrl.length > 0 ? <div>{preview}</div> : null}</div>;
};

export default PreviewLink;
