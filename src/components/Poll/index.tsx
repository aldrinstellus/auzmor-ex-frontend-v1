import IconButton, { Size, Variant } from 'components/IconButton';
import React, { useContext, useEffect, useState } from 'react';
import './styles.css';
import {
  CreatePostContext,
  CreatePostFlow,
  IPoll,
} from 'contexts/CreatePostContext';
import moment from 'moment';

export enum PollMode {
  VIEW = 'VIEW',
  EDIT = 'EDIT',
}

type PollProps = {
  mode: PollMode;
};

const Poll: React.FC<IPoll & PollProps> = ({
  question,
  options,
  total,
  closedAt,
  mode = PollMode.VIEW,
}) => {
  const [userVoted, setUserVoted] = useState<boolean>(false);
  const momentClosedAt = moment(new Date(closedAt));
  const { setPoll, setActiveFlow } = useContext(CreatePostContext);

  // Set thresholds for proper weeks, months, and years calculation.
  moment.relativeTimeThreshold('d', 7);
  moment.relativeTimeThreshold('w', 4);
  moment.relativeTimeThreshold('M', 12);

  useEffect(() => {
    if (userVoted) {
      options.forEach((option) => {
        if (option.id && total) {
          const element = document.getElementById(option.id);
          const widthPercent = ((option.votes || 0) / total) * 100;
          element?.animate(
            {
              width: ['0%', `${widthPercent}%`],
              easing: ['ease-out', 'ease-out'],
            },
            500,
          );
          element?.setAttribute('style', `width: ${widthPercent}%`);
        }
      });
    }
  }, [options, userVoted]);

  return (
    <div className="bg-neutral-100 py-4 px-8 rounded-9xl w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-neutral-900 font-bold">{question}</p>
        {mode === PollMode.EDIT && (
          <div className="flex gap-x-2">
            <IconButton
              icon="edit"
              onClick={() => setActiveFlow(CreatePostFlow.CreatePoll)}
              variant={Variant.Secondary}
              size={Size.Medium}
              borderAround
              color="text-black"
              className="bg-white rounded-7xl"
              borderAroundClassName="rounded-7xl"
              dataTestId="createpost-edit-poll"
            />
            <IconButton
              icon="close"
              onClick={() => setPoll(null)}
              variant={Variant.Secondary}
              size={Size.Medium}
              borderAround
              color="text-black"
              className="bg-white rounded-7xl"
              borderAroundClassName="rounded-7xl"
              dataTestId="createpost-remove-poll"
            />
          </div>
        )}
      </div>

      {/* Options */}
      <div className="py-4">
        {options.map((option) => (
          <div
            className="grid py-2 cursor-pointer"
            key={option.id}
            onClick={() => setUserVoted(true)}
          >
            {/* The white background that contains the option */}
            <div className="grid-area w-full cursor-pointer bg-white rounded-19xl" />
            {/* The progress bar that fills up the background */}
            <div
              className={`grid-area w-0 ${
                option.id === 'ghi' ? 'bg-emerald-600' : 'bg-green-100'
              } rounded-19xl`}
              id={option.id}
            />
            {/* The option itself */}
            <div className="grid-area flex items-center justify-center w-full px-5 py-3 text-neutral-900 font-medium">
              {option.text}
            </div>
          </div>
        ))}
      </div>

      {/* Time left */}
      <div>
        <p
          className="text-orange-500 font-bold"
          data-testid="createpost-poll-expiry"
        >
          {momentClosedAt.fromNow(true) + ' left'}
        </p>
      </div>
    </div>
  );
};

export default Poll;
