import { useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';
import { getTimeFromNow } from 'utils/time';

type AppProps = {
  startDate: string;
  userTimeZone: string;
};

const TimeChip: FC<AppProps> = ({ startDate, userTimeZone }) => {
  const [timeLeft, setTimeLeft] = useState<any>(
    getTimeFromNow(startDate, userTimeZone),
  );
  let interval: any;
  const queryClient = useQueryClient();

  useEffect(() => {
    // Calculate the difference between start date and current date
    const timeDiff = moment(startDate).diff(moment());
    if (timeDiff <= 0) {
      queryClient.invalidateQueries(['learnEvent']);
      return;
    }
    // Check if time left is less than 5 minutes
    if (timeDiff < 5 * 60 * 1000) {
      interval = setInterval(() => {
        if (moment(startDate).diff(moment()) <= 0) {
          queryClient.invalidateQueries(['learnEvent']);
          clearInterval(interval);
          return;
        }
        setTimeLeft(getTimeFromNow(startDate, userTimeZone));
      }, 1000);
    }

    // Clean up setInterval on component unmount
    return () => clearInterval(interval);
  }, []);

  return <div>{`Starts in ${timeLeft}`}</div>;
};

export default TimeChip;
