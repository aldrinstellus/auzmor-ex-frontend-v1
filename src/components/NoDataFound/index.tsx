import clsx from 'clsx';
import Button, { Variant } from 'components/Button';
import Icon from 'components/Icon';
import { FC, ReactNode } from 'react';

interface INoDataFoundProps {
  searchString?: string;
  message?: ReactNode;
  onClearSearch?: () => void;
  dataTestId?: string;
  className?: string;
  hideClearBtn?: boolean;
  hideText?: boolean;
  clearBtnLabel?: string;
  labelHeader?: ReactNode;
  illustration?: string;
  illustrationClassName?: string;
}

const illustrationMap: Record<string, any> = {
  noResult: { type: 'image', src: require('images/noResult.png') },
  noResultAlt: { type: 'image', src: require('images/noResultAlt.png') },
  noDocumentFound: {
    type: 'image',
    src: require('images/noDocumentSearch.png'),
  },
  noChannelFound: { type: 'image', src: require('images/notFound.png') },
  noSearchResultFound: {
    type: 'icon',
    src: 'noResultFound',
    size: 121,
    color: '!text-primary-500',
  },
};

const NoDataFound: FC<INoDataFoundProps> = ({
  searchString,
  message,
  labelHeader,
  onClearSearch,
  dataTestId,
  className = '',
  hideClearBtn = false,
  hideText = false,
  clearBtnLabel = 'Clear search',
  illustration = 'noResult',
  illustrationClassName = '',
}) => {
  const style = clsx({ [className]: true });
  const illustrationStyle = clsx({
    'flex w-full justify-center': true,
    [illustrationClassName]: true,
  });
  return (
    <div className={style}>
      <div className={illustrationStyle}>
        {illustrationMap[illustration]?.type === 'image' ? (
          <img src={illustrationMap[illustration].src} alt="No Data Found" />
        ) : null}
        {illustrationMap[illustration]?.type === 'icon' ? (
          <Icon
            name={illustrationMap[illustration].src}
            size={illustrationMap[illustration].size}
            color={illustrationMap[illustration].color}
          />
        ) : null}
      </div>
      {!hideText && (
        <div className="text-center">
          <div
            className="mt-6 text-lg font-bold text-neutral-900"
            data-testid={`${dataTestId}-noresult-found`}
          >
            {labelHeader}
            {!labelHeader &&
              `No result found ${
                !!searchString ? `for '${searchString}'` : ''
              }`}
          </div>
          <div className="text-sm text-gray-500 mt-4">{message}</div>
        </div>
      )}

      {!hideClearBtn && (
        <div className="flex justify-center mt-6 group">
          <Button
            label={clearBtnLabel}
            variant={Variant.Secondary}
            onClick={onClearSearch}
            dataTestId={`${dataTestId}-clear-applied-filter`}
            className="focus:border-black"
            labelClassName="text-sm text-neutral-900 font-bold group-hover:text-primary-600"
          />
        </div>
      )}
    </div>
  );
};

export default NoDataFound;
