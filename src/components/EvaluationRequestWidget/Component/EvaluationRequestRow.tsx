import clsx from 'clsx';
import Avatar from 'components/Avatar';
import Card from 'components/Card';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';
import Truncate from 'components/Truncate';
import moment from 'moment';
import React, { FC, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getLearnUrl } from 'utils/misc';

interface EvaluationRequestRowProps {
  className?: string;
  data?: Record<string, any>;
}

const EvaluationRequestRow: FC<EvaluationRequestRowProps> = ({
  className = '',
  data,
}) => {
  const { t } = useTranslation('learnWidget', {
    keyPrefix: 'evaluationRequestWidget',
  });

  const style = useMemo(
    () =>
      clsx({
        'p-2 rounded-7xl border-1 !border-neutral-200 w-[253px]': true,
        [className]: true,
      }),
    [className],
  );

  return (
    <Card className={style}>
      <div className="flex rounded justify-between items-center ">
        <div className="flex gap-1 items-center">
          <Tooltip tooltipContent={data?.module}>
            <Icon
              name={data?.module === 'Event' ? 'calendarTwo' : 'teacher'}
              size={16}
              color="text-primary-500"
            />
          </Tooltip>
          <Truncate
            className={'text-sm font-bold'}
            text={data?.source?.source_name || data?.module}
          />
        </div>
        <Tooltip tooltipContent={t('startEvaluationTooltip')}>
          <Icon
            onClick={() => {
              window.location.assign(
                `${getLearnUrl()}/evaluations/${data?.id}?status=PENDING`,
              );
            }}
            size={20}
            color="text-secondary-400"
            dataTestId="pending-evaluation"
            name="documentView"
          />
        </Tooltip>
      </div>
      <Divider className="my-1" />
      <div className="flex items-center gap-1 px-0 py-1 relative w-full">
        <Avatar
          name={data?.user?.full_name}
          image={data?.user?.image_url}
          bgColor={data?.user?.profile_color}
          size={32}
          className="border-2 border-white"
          onClick={() => {}}
        />
        <div className="flex flex-col items-start gap-1 flex-1 grow">
          <div className="flex items-center justify-between w-full">
            <Truncate
              className={'text-sm font-bold'}
              text={data?.user?.full_name}
            />
            <div className="flex items-center gap-1">
              <span className="text-xs text-neutral-500">{t('attempts')}:</span>
              <span className="text-xs text-neutral-500">{data?.attempt}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full">
            <div className="flex items-center gap-1">
              <Icon name="calendar" className="w-4 h-4" />
              <span className="text-xs text-neutral-500">
                {t('attemptedOn')}:
              </span>
            </div>
            <span className="text-xs text-neutral-500">
              {moment.utc(data?.submitted_at).format(t('dateFormat'))}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EvaluationRequestRow;
