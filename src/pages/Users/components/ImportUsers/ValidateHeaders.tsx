import Banner, { Variant } from 'components/Banner';
import Button, { Variant as BtnVariant, Size } from 'components/Button';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import { find } from 'lodash';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('profile', {
    keyPrefix: 'importUser.validateHeader',
  });

  if (isLoading) {
    return (
      <div className="px-6 pt-2 pb-4 space-y-4">
        <div className="v-center">
          <Spinner className="!h-5 !w-5" />
          <div className="pl-1 text-sm text-neutral-900">
            {t('checkingHeaders')}
          </div>
        </div>
        <div className="v-center">
          <Spinner className="!h-5 !w-5" />
          <div className="pl-1 text-sm text-neutral-900">
            {t('mappingColumns')}
          </div>
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
      <div className="w-full max-h-[148px] overflow-y-auto">
        {warning[0]}: &nbsp;
        {showMore ? (
          <span
            className="font-bold underline cursor-pointer"
            onClick={() => setShowMore(false)}
          >
            {t('viewLess')}
          </span>
        ) : (
          <span
            className="font-bold underline cursor-pointer"
            onClick={() => setShowMore(true)}
          >
            {t('viewDetails')}
          </span>
        )}
        {!error?.length && <div>{t('pressConfirm')}</div>}
        {showMore && (
          <p>
            <span className="font-bold underline">{t('columns')}:</span>
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
              <Banner variant={Variant.Error} title={t('errorMappingHeader')} />
            )}
            {isHeaderRowPresent && !!error?.length && (
              <Banner variant={Variant.Error} title={error.join(': ')} />
            )}

            {isHeaderRowPresent && !!warning?.length && (
              <Banner
                variant={Variant.Warning}
                title={<WarningBanner warning={warning} />}
                headingClassName="w-full"
                titleClassName="w-full"
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
                {t('checkingHeaders')}
              </div>
            </div>
            <div className="v-center">
              <Icon
                name={
                  isColumnMappingValid && !!!warning?.length
                    ? 'boldTick'
                    : 'infoCircleFilled'
                }
                hover={false}
                size={20}
                className={`${isColumnMappingValid && 'text-primary-500'}  ${
                  !!warning?.length && 'text-yellow-300'
                } ${!isColumnMappingValid && '!text-red-500'}`}
              />
              {!!warning?.length ? (
                <div className="text-sm text-neutral-900">
                  {t('columnsMappedIncorrectly')}
                </div>
              ) : (
                <div className="text-sm text-neutral-900">
                  {t('mappingColumns')}
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {((isCsv && !isLoading) || !isCsv) && (
        <div className="flex items-center justify-end h-16 p-6 bg-blue-50 rounded-b-9xl">
          <Button
            label={t('cancel')}
            variant={BtnVariant.Secondary}
            size={Size.Small}
            className="mr-4"
            onClick={closeModal}
            dataTestId="import-people-cancel"
          />
          <Button
            label={t('confirm')}
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
