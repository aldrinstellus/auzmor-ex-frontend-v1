import React, { useMemo } from 'react';
import { usePreviewLink } from 'queries/post';
import ImagePreview from './components/ImagePreview';
import IconPreview from './components/IconPreview';

export type PreviewLinkProps = {
  link: string[];
  setShowPreview: (show: boolean) => void;
};

const PreviewLink: React.FC<PreviewLinkProps> = ({ link, setShowPreview }) => {
  const { data, isLoading } = usePreviewLink(link[0]);
  console.log(link, '$$$', '%', data);

  const preview = useMemo(() => {
    if (data?.open_graph?.images && data?.open_graph?.images.length > 0) {
      return <ImagePreview metaData={data} setShowPreview={setShowPreview} />;
    } else if (data?.favicon) {
      return <IconPreview metaData={data} setShowPreview={setShowPreview} />;
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

  return <div>{link.length > 0 && <div>{preview}</div>}</div>;
};

export default PreviewLink;
