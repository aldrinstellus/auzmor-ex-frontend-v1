import { FC, useContext } from 'react';

import { usePreviewLink } from 'queries/post';
import { useDebounce } from 'hooks/useDebounce';
import IconButton, {
  Variant as IconVariant,
  Size,
} from 'components/IconButton';
import PreviewCard from 'components/PreviewCard';
import { CreatePostContext } from 'contexts/CreatePostContext';

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

const PreviewLink: FC<PreviewLinkProps> = ({
  previewUrl = '',
  // setPreviewUrl = () => {},
  setIsPreviewRemove = () => {},
}) => {
  const { media } = useContext(CreatePostContext);
  const debouncePreviewUrl = useDebounce(previewUrl, 1000);

  const { data, isLoading, isError } = usePreviewLink(debouncePreviewUrl);

  if (!previewUrl) {
    return null;
  }

  const isMetaDataPresent = ['image', 'favicon', 'title'].some((value) =>
    data?.hasOwnProperty(value),
  );

  return (
    <div className="relative m-6">
      {isMetaDataPresent && !isLoading && media.length === 0 && (
        <IconButton
          icon="closeOutline"
          className="absolute bg-white top-4 right-4 border-1 border-neutral-200 border-solid !rounded-7xl p-2"
          variant={IconVariant.Secondary}
          size={Size.Small}
          onClick={() => {
            setIsPreviewRemove(true);
          }}
          dataTestId="createpost-remove-sharedlink"
        />
      )}
      {media.length === 0 && (
        <PreviewCard metaData={data} isLoading={isLoading} isError={isError} />
      )}
    </div>
  );
};

export default PreviewLink;
