import Banner, { Variant } from 'components/Banner';
import Button, { Variant as BtnVariant, Size } from 'components/Button';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import { find } from 'lodash';
import React, { FC, useState } from 'react';

type AppProps = {
  isLoading: boolean;
  isSuccess: boolean;
  meta: Record<string, any>;
  closeModal: () => any;
  disableSubmit?: boolean;
  selectedSheet?: number;
  isCsv?: boolean;
  onConfirm: (...args: any) => any;
};

const ValidateHeaders: React.FC<AppProps> = ({
  isLoading,
  meta,
  closeModal,
  disableSubmit = false,
  selectedSheet,
  isCsv = true,
  onConfirm,
}) => {
  if (isLoading) {
    return (
      <div className="px-6 pt-2 pb-4 space-y-4">
        <div className="v-center">
          <Spinner className="!h-5 !w-5" />
          <div className="pl-1 text-sm text-neutral-900">
            Checking for headers
          </div>
        </div>
        <div className="v-center">
          <Spinner className="!h-5 !w-5" />
          <div className="pl-1 text-sm text-neutral-900">Mapping Columns</div>
        </div>
      </div>
    );
  }

  const sheets = meta?.parsedData?.result?.data?.info?.sheets || [];
  const sheetRes =
    (sheets?.length === 1
      ? sheets[0]
      : find(sheets, { index: selectedSheet })) || {};

  const isColumnMappingValid = sheetRes['isColumnMappingValid'];
  const isHeaderRowPresent = sheetRes['isHeaderRowPresent'];
  const error = sheetRes['error'] || [];
  const warning = sheetRes['warning'] || [];
  const _disableSubmit =
    disableSubmit || !!error?.length || !isHeaderRowPresent;

  const WarningBanner: FC<any> = ({ warning }) => {
    const [showMore, setShowMore] = useState<boolean>(false);
    return (
      <div>
        {warning[0]}: &nbsp;
        {showMore ? (
          <span
            className="font-bold underline cursor-pointer"
            onClick={() => setShowMore(false)}
          >
            view less
          </span>
        ) : (
          <span
            className="font-bold underline cursor-pointer"
            onClick={() => setShowMore(true)}
          >
            view details
          </span>
        )}
        {!error?.length && <div>Press confirm to ignore these columns.</div>}
        {showMore && (
          <p>
            <span className="font-bold underline">Columns:</span>
            <br />
            {warning[1].split(',').map((column: string) => (
              <>
                <span key={column}>{column}</span>
                <br />
              </>
            ))}
          </p>
        )}
      </div>
    );
  };

  return (
    <div>
      {(isCsv || (!isCsv && selectedSheet)) && (
        <>
          <div className="px-6 pt-2 pb-4 space-y-4">
            {!isHeaderRowPresent && (
              <Banner variant={Variant.Error} title="Error mapping header" />
            )}
            {isHeaderRowPresent && !!error?.length && (
              <Banner variant={Variant.Error} title={error.join(': ')} />
            )}

            {isHeaderRowPresent && !!warning?.length && (
              <Banner
                variant={Variant.Warning}
                title={<WarningBanner warning={warning} />}
              />
            )}

            <div className="v-center">
              <Icon
                name={isHeaderRowPresent ? 'boldTick' : 'infoCircle'}
                size={20}
                className={
                  isHeaderRowPresent ? 'text-primary-500' : 'text-red-500'
                }
              />
              <div className="text-sm text-neutral-900">
                Checking for headers
              </div>
            </div>
            <div className="v-center">
              <Icon
                name={isColumnMappingValid ? 'boldTick' : 'infoCircle'}
                size={20}
                className={
                  isColumnMappingValid ? 'text-primary-500' : 'text-red-500'
                }
              />
              <div className="text-sm text-neutral-900">Mapping Columns</div>
            </div>
          </div>
        </>
      )}
      {((isCsv && !isLoading) || !isCsv) && (
        <div className="flex items-center justify-end h-16 p-6 bg-blue-50 rounded-b-9xl">
          <Button
            label="Cancel"
            variant={BtnVariant.Secondary}
            size={Size.Small}
            className="mr-4"
            onClick={closeModal}
            dataTestId="import-people-cancel"
          />
          <Button
            label="Confirm"
            size={Size.Small}
            dataTestId="import-people-next"
            onClick={onConfirm}
            disabled={_disableSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default ValidateHeaders;
