import React, { FC } from 'react';
import Tracker from 'images/tracker.svg';
import Card from 'components/Card';
import { useTranslation } from 'react-i18next';

interface IEmptyStateProps {}

const EmptyState: FC<IEmptyStateProps> = ({}) => {
  const { t } = useTranslation('learnWidget', { keyPrefix: 'progressTracker' });
  return (
    <Card className="flex flex-col w-full py-9 items-center gap-4">
      <img src={Tracker} className="opacity-75" alt="Tracker Picture" />
      <p className="text-base font-bold text-neutral-900 text-center">
        {t('notFoundHeader')}
      </p>
      <p className="text-neutral-500 text-xs"> {t('notFoundLabel')}</p>
    </Card>
  );
};

export default EmptyState;
