import { FC, useContext } from 'react';

import { useDebounce } from 'hooks/useDebounce';
import IconButton, {
  Variant as IconVariant,
  Size,
} from 'components/IconButton';
import PreviewCard from 'components/PreviewCard';
import { CreatePostContext } from 'contexts/CreatePostContext';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';

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
  showCloseIcon?: boolean;
  className?: string;
  showViewLink?: boolean;
  imgHeight?: string;
  textHeight?: string;
};

const PreviewLink: FC<PreviewLinkProps> = ({
  previewUrl = '',
  // setPreviewUrl = () => {},
  setIsPreviewRemove = () => {},
  showCloseIcon = true,
  className ='',
  showViewLink = false,
  imgHeight = '',
  textHeight = '',
}) => {
  const { media, poll } = useContext(CreatePostContext);
  const debouncePreviewUrl = useDebounce(previewUrl, 1000);

  const { getApi } = usePermissions();
  const usePreviewLink = getApi(ApiEnum.GetLinkPreview);
  const { data, isLoading, isError } = usePreviewLink(debouncePreviewUrl);

  if (!previewUrl) {
    return null;
  }

  const isMetaDataPresent = ['image', 'favicon', 'title'].some((value) =>
    data?.hasOwnProperty(value),
  );

  return (
    <div className="relative m-6 h-full">
      {showCloseIcon && isMetaDataPresent && !isLoading && media.length === 0 && !poll && (
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
      {media.length === 0 && !poll && (
        <PreviewCard
          previewUrl={previewUrl}
          metaData={data}
          isLoading={isLoading}
          isError={isError}
          className={className}
          showViewLink={showViewLink}
          imgHeight={imgHeight}
          textHeight={textHeight}
        />
      )}
    </div>
  );
};

export default PreviewLink;
