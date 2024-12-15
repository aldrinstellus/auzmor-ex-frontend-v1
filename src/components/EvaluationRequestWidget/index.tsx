import clsx from 'clsx';
import Button, { Variant } from 'components/Button';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getLearnUrl } from 'utils/misc';
import EvaluationRequestRow from './Component/EvaluationRequestRow';
import Card from 'components/Card';
import EmptyState from './Component/EmptyState';
import Skeleton from 'react-loading-skeleton';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

export interface IEvaluationRequestWidgetProps {
  className?: string;
}

const EvaluationRequestWidget = ({ className = '' }) => {
  const { getApi } = usePermissions();

  const { t } = useTranslation('learnWidget', {
    keyPrefix: 'evaluationRequestWidget',
  });

  const modules = ['Course', 'Event'];

  const useGetEvaluations = getApi(ApiEnum.GetEvaluations);
  const { data, isLoading } = useGetEvaluations({
    q: '',
    status: 'PENDING',
    modules: modules?.map((each) => each).join(','),
    limit: 3,
    page: 1,
  });
  const evaluationRequestData = data?.result?.data || [];

  const style = useMemo(
    () => clsx({ 'min-w-[293px]': true, [className]: true }),
    [className],
  );
  const totalCount = data?.result?.total_records;

  const widgetTitle = (
    <p className="flex">
      {t('pendingEvaluation')} &#40;&nbsp;
      {isLoading ? <Skeleton count={1} className="!w-8 h-5" /> : totalCount}
      &nbsp;&#41;
    </p>
  );
  return (
    <div className={style}>
      <div className="flex justify-between items-center ">
        <div className="text-base font-bold leading-6">{widgetTitle}</div>
        <Button
          variant={Variant.Secondary}
          label={t('viewAll')}
          dataTestId={'pending-evaluation-view-all'}
          className="border-0 !bg-transparent !px-0 !py-1 group"
          labelClassName=" text-primary-500 hover:text-primary-600  group-focus:text-primary-500"
          onClick={() => window.location.assign(`${getLearnUrl()}/evaluations`)}
        />
      </div>
      <div className="mt-2">
        {!isLoading && evaluationRequestData.length === 0 ? (
          <EmptyState />
        ) : (
          <Card className="flex flex-col w-full h-[347px] py-4 px-3 gap-3 items-center ">
            {evaluationRequestData.map((data: any) => {
              return <EvaluationRequestRow key={data?.id} data={data} />;
            })}
          </Card>
        )}
      </div>
    </div>
  );
};

export default EvaluationRequestWidget;
