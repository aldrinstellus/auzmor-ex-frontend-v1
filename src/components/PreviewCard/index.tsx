import Card from 'components/Card';
import IconPreview from 'components/PreviewLink/components/IconPreview';
import ImagePreview from 'components/PreviewLink/components/ImagePreview';
import { Metadata } from 'components/PreviewLink/types';
import React, { useMemo } from 'react';

type PreviewCardProps = {
  metaData: Metadata;
  className?: string;
  isLoading?: boolean;
  isError?: boolean;
};

const PreviewCard: React.FC<PreviewCardProps> = ({
  metaData,
  className,
  isLoading,
  isError,
}) =>
  useMemo(() => {
    if (metaData?.image) {
      return (
        <Card className={`${className} cursor-pointer`}>
          <ImagePreview metaData={metaData} />
        </Card>
      );
    } else if (metaData?.favicon) {
      return (
        <Card
          className={`${className} cursor-pointer bg-[#F7F8FB] h-[166px] rounded-7xl`}
        >
          <IconPreview metaData={metaData} />
        </Card>
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
  }, [metaData, isLoading, isError]);

export default PreviewCard;
