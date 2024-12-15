import React, { FC } from 'react';
import EmptyPendingTask from 'images/EmptyPendingTask.svg';
import Card from 'components/Card';
import { useTranslation } from 'react-i18next';
import Button, { Size, Variant } from 'components/Button';
import { getLearnUrl } from 'utils/misc';

interface IEmptyStateProps {}

const EmptyState: FC<IEmptyStateProps> = () => {
  const { t } = useTranslation('learnWidget', {
    keyPrefix: 'evaluationRequestWidget',
  });

  return (
    <Card className="flex flex-col px-6 py-9 items-center gap-4">
      <img
        src={EmptyPendingTask}
        className="opacity-75"
        alt={t('trackerPictureAlt')}
      />
      <p className="text-base font-bold text-neutral-900 text-center">
        {t('noPendingEvaluations')}
      </p>
      <Button
        variant={Variant.Secondary}
        size={Size.Small}
        className="py-[7px] w-full"
        label={t('viewAllCompletedButton')}
        dataTestId="explore-channels"
        onClick={() => window.location.assign(`${getLearnUrl()}/evaluations`)}
      />
    </Card>
  );
};

export default EmptyState;
