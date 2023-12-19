import Banner, { Variant } from 'components/Banner';
import Button, { Variant as BtnVariant, Size } from 'components/Button';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import { find } from 'lodash';
import React from 'react';

type AppProps = {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  meta: Record<string, any>;
  closeModal: () => any;
  mutation: any;
  disableSubmit?: boolean;
  selectedSheet?: number;
  isCsv?: boolean;
};

const ValidateHeaders: React.FC<AppProps> = ({
  isLoading,
  meta,
  closeModal,
  mutation,
  disableSubmit = false,
  selectedSheet,
  isCsv = true,
}) => {
  if (isLoading) {
    return (
      <div className="px-6 pt-2 pb-4 space-y-4">
        <div className="v-center">
          <Spinner className="!h-5 !w-5" />
          <div className="text-sm text-neutral-900 pl-1">
            Checking for headers
          </div>
        </div>
        <div className="v-center">
          <Spinner className="!h-5 !w-5" />
          <div className="text-sm text-neutral-900 pl-1">Mapping Columns</div>
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

  return (
    <div>
      {(isCsv || (!isCsv && selectedSheet)) && (
        <>
          <div className="px-6 pt-2 pb-4 space-y-4">
            {!!error?.length && (
              <Banner variant={Variant.Error} title={error.join(': ')} />
            )}
            {!isHeaderRowPresent && (
              <Banner variant={Variant.Error} title="Error mapping header" />
            )}
            {!!warning?.length && (
              <Banner
                variant={Variant.Warning}
                title={
                  <div>
                    {warning.join(': ')}
                    {!error?.length && (
                      <div>Press confirm to ignore these columns.</div>
                    )}
                  </div>
                }
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
        <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
          <Button
            label="Cancel"
            variant={BtnVariant.Secondary}
            size={Size.Small}
            className="mr-4"
            onClick={closeModal}
            dataTestId="import-people-cancel"
            disabled={mutation.isLoading}
          />
          <Button
            label="Confirm"
            size={Size.Small}
            dataTestId="import-people-next"
            onClick={() => {
              mutation.mutate();
            }}
            disabled={_disableSubmit || mutation.isLoading}
            loading={mutation.isLoading}
          />
        </div>
      )}
    </div>
  );
};

export default ValidateHeaders;
