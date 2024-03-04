import Button, { Size } from 'components/Button';
import Card from 'components/Card';
import LearnCard from 'components/LearnCard';
import { useShouldRender } from 'hooks/useShouldRender';
import React, { FC } from 'react';

const ID = 'Recommendation';

interface IRecommendationProps {
  title: string;
  cards: Record<string, any>[];
  isLoading?: boolean;
}

const Recommendation: FC<IRecommendationProps> = ({
  title,
  cards,
  isLoading,
}) => {
  const shouldRender = useShouldRender(ID);
  if (!shouldRender || !cards.length) {
    return <></>;
  }
  return (
    <Card className="flex-col gap-4 p-4">
      <div className="flex justify-between">
        <p className="text-xs font-bold text-neutral-900">{title}</p>
        <Button
          label="Show more"
          rightIcon={'arrowRight'}
          rightIconSize={12}
          rightIconClassName="text-primary-500"
          size={Size.ExtraSmall}
          className="!bg-transparent !text-primary-500 hover:text-primary-600 active:text-primary-700 text-xs font-normal"
        />
      </div>
      <div className="flex gap-4">
        {cards.map((card: Record<string, any>) => (
          <LearnCard
            className="!w-[254px] !h-[290px]"
            data={card}
            key={card.id}
            isLoading={isLoading}
          />
        ))}
      </div>
    </Card>
  );
};

export default Recommendation;
