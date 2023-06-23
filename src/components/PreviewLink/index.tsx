import React from 'react';
import { usePreviewLink } from 'queries/post';
import { useDebounce } from 'hooks/useDebounce';
import IconButton, {
  Variant as IconVariant,
  Size,
} from 'components/IconButton';
import PreviewCard from 'components/PreviewCard';

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
};

const PreviewLink: React.FC<PreviewLinkProps> = ({
  previewUrl = '',
  setPreviewUrl = () => {},
  setIsPreviewRemove = () => {},
}) => {
  const debouncePreviewUrl = useDebounce(previewUrl, 1000);

  const { data, isLoading, isError } = usePreviewLink(debouncePreviewUrl);

  if (!previewUrl) {
    return null;
  }

  const isMetaDataPresent = ['image', 'favicon', 'title'].some((value) =>
    data?.hasOwnProperty(value),
  );

  return (
    <div className="relative">
      {isMetaDataPresent && !isLoading && (
        <IconButton
          icon="closeOutline"
          className="absolute bg-white top-0 right-0 border-1 border-neutral-200 border-solid rounded-7xl mx-8 my-4 p-2"
          variant={IconVariant.Secondary}
          size={Size.Small}
          onClick={() => {
            setPreviewUrl('');
            setIsPreviewRemove(true);
          }}
          dataTestId="createpost-remove-sharedlink"
        />
      )}
      <PreviewCard
        metaData={data}
        isLoading={isLoading}
        isError={isError}
        className="mx-6 mb-9"
      />
    </div>
  );
};

export default PreviewLink;
