import { useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';
import { getTimeFromNow } from 'utils/time';

type AppProps = {
  startDate: string;
  userTimeZone: string;
  isLive?: boolean;
};

const TimeChip: FC<AppProps> = ({ startDate, userTimeZone, isLive }) => {
  const [timeLeft, setTimeLeft] = useState<any>(''); // State to store the time left
  let interval: any;
  const queryClient = useQueryClient();
  useEffect(() => {
    updateTimeLeft();
    // Clean up setInterval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Function to calculate and update time left
  const updateTimeLeft = async () => {
    if (startDate && !isLive) {
      const finalDate = moment(startDate);
      const currentDate = moment();
      // Calculate the difference between finalDate and currentDate
      const timeDiff = finalDate.diff(currentDate);
      // console.log('timeDiff :', timeDiff);
      if (timeDiff == 0) {
        await queryClient.invalidateQueries(['learnEvent']);
      }
      // Check if time left is less than a minute
      if (timeDiff <= 60000) {
        // 60000 milliseconds = 1 minute
        // Re-render every second
        interval = setInterval(() => {
          updateTimeLeft();
        }, 1000);
      } else if (timeDiff <= 3600000) {
        // 3600000 milliseconds = 1 hour
        // Re-render every minute
        interval = setInterval(() => {
          updateTimeLeft();
        }, 60000);
      } else {
        // If time left is more than an hour, clear the interval
        clearInterval(interval);
      }
      // Format the time difference
      const formattedTimeLeft = getTimeFromNow(startDate, userTimeZone);
      setTimeLeft(formattedTimeLeft);
    }
  };
  return <div>{`Start in ${timeLeft}`}</div>;
};

export default TimeChip;
