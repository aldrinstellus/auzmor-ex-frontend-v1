import Button, { Size } from 'components/Button';
import Card from 'components/Card';
import LearnCard from 'components/LearnCard';
import React, { FC } from 'react';

interface IRecommendationProps {
  title: string;
  cards: Record<string, any>[];
  isLoading?: boolean;
  onCLick: () => void;
}

const Recommendation: FC<IRecommendationProps> = ({
  title,
  cards,
  isLoading,
  onCLick,
}) => {
  return (
    <Card className="flex flex-col gap-4 px-4 pt-4 relative h-[392px]">
      <div>
        <p className="text-sm font-bold text-neutral-900">{title}</p>
      </div>
      <div className="flex top-8 gap-4 w-full overflow-hidden hover:overflow-x-scroll pb-4">
          {cards.map((card: Record<string, any>) => (
            <LearnCard  
              className={`${cards.length === 1 ? 'w-full' : cards.length === 2 ? 'w-[calc(50%-0.5rem)]' : 'w-[254px]'} h-[290px] flex-shrink-0`}
              data={card}
              key={card.id}
              isLoading={isLoading}
            />
          ))}
      </div>
      <div className='flex items-center justify-center'>
        <Button
          label="View All"
          rightIcon="arrowRight"
          rightIconSize={12}
          rightIconClassName="!text-black"
          size={Size.ExtraSmall}
          onClick={onCLick}
          className="!bg-transparent !text-black hover:!text-black active:!text-black text-xs font-bold outline-1 outline focus:outline-primary-500"
        />
      </div>
    </Card>
  );
};

export default Recommendation;
