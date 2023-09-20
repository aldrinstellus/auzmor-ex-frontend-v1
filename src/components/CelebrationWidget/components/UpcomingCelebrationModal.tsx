import { FC, useContext, useEffect, useRef, useState } from 'react';
import momentTz from 'moment-timezone';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import { CELEBRATION_TYPE } from '..';
import Button, { Size, Variant } from 'components/Button';
import User from './User';
import { useCelebrations } from 'queries/post';
import SkeletonLoader from './SkeletonLoader';
import { AuthContext } from 'contexts/AuthContext';
import { useCurrentTimezone } from 'hooks/useCurrentTimezone';
import Spinner from 'components/Spinner';
import { useInView } from 'react-intersection-observer';
import { isFiltersEmpty } from 'utils/misc';

interface UpcomingCelebrationModalProps {
  open: boolean;
  closeModal: () => void;
  type: CELEBRATION_TYPE;
}

const UpcomingCelebrationModal: FC<UpcomingCelebrationModalProps> = ({
  open,
  closeModal,
  type,
}) => {
  const { user } = useContext(AuthContext);
  const { currentTimezone } = useCurrentTimezone();
  const userTimezone = user?.timezone || currentTimezone || 'Asia/Kolkata';
  const currentDate = momentTz().tz(userTimezone);
  const isBirthday = type === CELEBRATION_TYPE.Birthday;
  const monthRef = useRef<any>(null);
  const thisMonthRef = useRef<any>(null);
  const monthCounterRef = useRef<any>(null);
  const { ref, inView } = useInView();
  const [stopScroll, setStopScroll] = useState(false);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useCelebrations(
      isFiltersEmpty({
        limit: 10,
        type: isBirthday ? 'BIRTHDAY' : 'WORK_ANNIVERSARY',
      }),
    );

  const formattedData = data?.pages.flatMap((page: any) => {
    return page?.data?.result?.data.map((celebration: any) => {
      try {
        const celebrationDate = momentTz(celebration.nextOcassionDateTime).tz(
          userTimezone,
        );
        if (monthCounterRef.current === null) {
          monthCounterRef.current = celebrationDate.month();
        }
        if (
          monthCounterRef.current !== null &&
          (celebrationDate.month() > monthCounterRef.current + 1 ||
            celebrationDate.year() > currentDate.year()) &&
          !stopScroll
        ) {
          setStopScroll(true);
        }
        return celebration;
      } catch (e) {
        console.log('Error', { celebration });
      }
    });
  });

  const todaysCelebrationWithNoPost: any[] = [];
  let todaysCelebration = formattedData
    ? formattedData.filter((item) => {
        const itemDate = momentTz(item.nextOcassionDateTime).tz(userTimezone);
        if (
          itemDate.month() === currentDate.month() &&
          itemDate.date() === currentDate.date() &&
          itemDate.format('MM-DD') >= currentDate.format('MM-DD') &&
          itemDate.year() === currentDate.year()
        ) {
          if (thisMonthRef.current === null) {
            thisMonthRef.current = itemDate.month();
          }
          if (!item.post.id) {
            todaysCelebrationWithNoPost.push(item);
            return false;
          }
          return true;
        }
        return false;
      })
    : [];
  todaysCelebration = [...todaysCelebration, ...todaysCelebrationWithNoPost];

  const thisMonthCelebration = formattedData
    ? formattedData.filter((item) => {
        const itemDate = momentTz(item.nextOcassionDateTime).tz(userTimezone);
        if (
          itemDate.month() === currentDate.month() &&
          itemDate.date() !== currentDate.date() &&
          itemDate.format('MM-DD') >= currentDate.format('MM-DD') &&
          itemDate.year() === currentDate.year()
        ) {
          if (thisMonthRef.current === null) {
            thisMonthRef.current = itemDate.month();
          }
          return true;
        }
        return false;
      })
    : [];

  const upcomingMonthCelebration = formattedData
    ? formattedData.filter((item) => {
        const itemDate = momentTz(item.nextOcassionDateTime).tz(userTimezone);
        const isSameYearAndSameorLaterMonth =
          itemDate.year() === currentDate.year() &&
          itemDate.format('MM-DD') >= currentDate.format('MM-DD');
        // if there was data for this month found, then just check for next month data
        if (thisMonthRef.current !== null) {
          return (
            itemDate.month() === currentDate.month() + 1 &&
            isSameYearAndSameorLaterMonth
          );
        } else {
          // whenever a new celebration is found for a month, keep track of it
          if (monthRef.current === null && isSameYearAndSameorLaterMonth) {
            monthRef.current = itemDate.month();
            return true;
          }

          // then filter out the data for next 2 months
          if (
            monthRef.current !== null &&
            isSameYearAndSameorLaterMonth &&
            (itemDate.month() === monthRef.current ||
              itemDate.month() === monthRef.current + 1)
          ) {
            return true;
          }
        }

        return false;
      })
    : [];

  const modalTitle =
    type === CELEBRATION_TYPE.Birthday
      ? 'Upcoming birthdays 🎂'
      : 'Upcoming work anniversaries 🎉';

  useEffect(() => {
    if (inView && !stopScroll) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <Modal open={open} closeModal={closeModal} className="max-w-[648px]">
      <Header title={modalTitle} onClose={closeModal} />
      <div className="max-h-[390px] min-h-[390px] overflow-y-auto px-6 w-full">
        {(() => {
          if (isLoading) {
            return (
              <>
                {[...Array(5)].map((element) => (
                  <div key={element} className="py-4">
                    <SkeletonLoader />
                  </div>
                ))}
              </>
            );
          }
          if (
            todaysCelebration.length > 0 ||
            thisMonthCelebration.length > 0 ||
            upcomingMonthCelebration.length > 0
          ) {
            return (
              <>
                {/* Todays celebration */}
                {todaysCelebration.length > 0 &&
                  (upcomingMonthCelebration.length > 0 ||
                    thisMonthCelebration.length > 0) && (
                    <div className="text-sm font-semibold px-2 mt-4">Today</div>
                  )}
                <div className="divide-y divide-neutral-200">
                  {todaysCelebration.map((celebration) => (
                    <div className="py-4" key={celebration.featuredUser.userId}>
                      <User
                        type={type}
                        data={celebration}
                        closeModal={closeModal}
                        isModalView
                      />
                    </div>
                  ))}
                </div>

                {/* This month celebration */}
                {thisMonthCelebration.length > 0 &&
                  (upcomingMonthCelebration.length > 0 ||
                    todaysCelebration.length > 0) && (
                    <div className="text-sm font-semibold px-2 pt-4 border-t border-neutral-200">
                      This Month
                    </div>
                  )}
                <div className="divide-y divide-neutral-200">
                  {thisMonthCelebration.map((celebration) => (
                    <div className="py-4" key={celebration.featuredUser.userId}>
                      <User
                        type={type}
                        data={celebration}
                        closeModal={closeModal}
                        isModalView
                      />
                    </div>
                  ))}
                </div>

                {/* Upcoming Month celebration */}
                {upcomingMonthCelebration.length > 0 &&
                  (thisMonthCelebration.length > 0 ||
                    todaysCelebration.length > 0) && (
                    <div className="text-sm font-semibold px-2 pt-4 border-t border-neutral-200">
                      Next Month
                    </div>
                  )}
                <div className="divide-y divide-neutral-200">
                  {upcomingMonthCelebration.map((celebration) => (
                    <div className="py-4" key={celebration.featuredUser.userId}>
                      <User
                        type={type}
                        data={celebration}
                        closeModal={closeModal}
                        isModalView
                      />
                    </div>
                  ))}
                </div>

                {hasNextPage && !stopScroll && !isFetchingNextPage && (
                  <div className="h-12 w-12">
                    <div ref={ref} />
                  </div>
                )}
                {isFetchingNextPage && (
                  <div className="flex justify-center w-full">
                    <div className="w-5 h-5">
                      <Spinner />
                    </div>
                  </div>
                )}
              </>
            );
          }
          return <></>;
        })()}
      </div>
      <div className="flex justify-end items-center h-16 px-6 py-4 bg-blue-50 rounded-b-9xl">
        <Button
          label="Close"
          variant={Variant.Secondary}
          size={Size.Small}
          className="py-[7px]"
          onClick={closeModal}
        />
      </div>
    </Modal>
  );
};

export default UpcomingCelebrationModal;
