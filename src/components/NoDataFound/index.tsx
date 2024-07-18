import clsx from 'clsx';
import Button, { Variant } from 'components/Button';
import { FC, ReactNode } from 'react';

interface INoDataFoundProps {
  searchString?: string;
  message?: ReactNode;
  onClearSearch?: () => void;
  dataTestId?: string;
  className?: string;
  hideClearBtn?: boolean;
  clearBtnLabel?: string;
  labelHeader?: ReactNode;
  illustration?: string;
}

const illustrationMap: Record<string, any> = {
  noResult: require('images/noResult.png'),
  noResultAlt: require('images/noResultAlt.png'),
  noDocumentFound: require('images/noDocumentSearch.png'),
  noChannelFound: require('images/notFound.png'),
};

const NoDataFound: FC<INoDataFoundProps> = ({
  searchString,
  message,
  labelHeader,
  onClearSearch,
  dataTestId,
  className = '',
  hideClearBtn = false,
  clearBtnLabel = 'Clear search',
  illustration = 'noResult',
}) => {
  const style = clsx({ [className]: true });
  return (
    <div className={style}>
      <div className="flex w-full justify-center">
        <img src={illustrationMap[illustration]} alt="No Data Found" />
      </div>
      <div className="text-center">
        <div
          className="mt-8 text-lg font-bold text-neutral-900"
          data-testid={`${dataTestId}-noresult-found`}
        >
          {labelHeader}
          {!labelHeader &&
            `No result found ${!!searchString ? `for '${searchString}'` : ''}`}
        </div>
        <div className="text-sm text-gray-500 mt-2">{message}</div>
      </div>

      {!hideClearBtn && (
        <div className="flex justify-center mt-6 group">
          <Button
            label={clearBtnLabel}
            variant={Variant.Secondary}
            onClick={onClearSearch}
            dataTestId={`${dataTestId}-clear-applied-filter`}
            labelClassName="text-neutral-500 group-hover:text-primary-600"
          />
        </div>
      )}
    </div>
  );
};

export default NoDataFound;
