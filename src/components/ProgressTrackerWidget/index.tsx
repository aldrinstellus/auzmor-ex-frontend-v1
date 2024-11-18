import clsx from 'clsx';
import Button, { Variant } from 'components/Button';
import LearnCard from 'components/LearnCard';
import React, { FC, useMemo } from 'react';
import { getLearnUrl } from 'utils/misc';
import EmptyState from './EmptyState';
import { useTranslation } from 'react-i18next';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';
import useProduct from 'hooks/useProduct';

interface IProgressTrackerWidgetProps {
  className?: string;
}

const ProgressTrackerWidget: FC<IProgressTrackerWidgetProps> = ({
  className = '',
}) => {
  const { t } = useTranslation('learnWidget', { keyPrefix: 'progressTracker' });
  const { getApi } = usePermissions();
  const { isLxp } = useProduct();

  const useProgressTracker = getApi(ApiEnum.GetProgressTracker);
  const { data, isLoading } = useProgressTracker({ enabled: isLxp });
  const trackerData = data?.data.result?.data || [];

  const style = useMemo(
    () => clsx({ 'min-w-[240px]': true, [className]: true }),
    [className],
  );

  const getSlug = () => {
    if (trackerData.length === 0) {
      return '/user/trainings?type=elearning&tab=PUBLIC';
    }
    if (trackerData[0]?.my_enrollment?.status === 'IN_PROGRESS') {
      if (!!trackerData[0]?.my_enrollment?.overdue) {
        return '/user/trainings?type=elearning&tab=OVERDUE';
      } else {
        return '/user/trainings?type=elearning&tab=IN_PROGRESS';
      }
    } else {
      return `/user/trainings?type=elearning&tab=${trackerData[0]?.my_enrollment?.status}`;
    }
  };

  return (
    <div className={style}>
      <div className="flex justify-between items-center ">
        <div className="text-base font-bold">{t('progressTracker')}</div>

        <Button
          variant={Variant.Secondary}
          label={t('viewAll')}
          className="border-0 !bg-transparent !px-0 !py-1 group"
          labelClassName=" text-primary-500 hover:text-primary-600  group-focus:text-primary-500"
          onClick={() => window.location.assign(`${getLearnUrl(getSlug())}`)}
        />
      </div>
      <div className="mt-2">
        {!isLoading && trackerData.length === 0 ? (
          <EmptyState />
        ) : (
          <LearnCard
            showProgressInfo
            data={{ ...trackerData[0] }}
            isLoading={isLoading}
            medalPosition="bottom"
          />
        )}
      </div>
    </div>
  );
};

export default ProgressTrackerWidget;
