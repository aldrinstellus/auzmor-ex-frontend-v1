import Icon from 'components/Icon';
import React, { FC } from 'react';

interface IRatingProps {
  rating?: number;
}

const Rating: FC<IRatingProps> = ({ rating = 0 }) => {
  const fullStarCount = Math.floor(rating);
  const halfStarCount = Math.ceil(rating - fullStarCount);
  return (
    <div className="flex gap-0.5 items-center">
      {[...Array(fullStarCount)].map((index) => (
        <Icon key={index} name="star" size={16} />
      ))}
      {[...Array(halfStarCount)].map((index) => (
        <Icon key={index} name="starHalf" size={16} />
      ))}
      <p className="text-white text-xs font-medium h-4">{rating}</p>
    </div>
  );
};

export default Rating;
