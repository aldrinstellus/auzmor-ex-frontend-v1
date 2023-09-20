import { FC, memo, useContext, useRef } from 'react';
import momentTz from 'moment-timezone';
import Card from 'components/Card';
import Icon from 'components/Icon';
import useModal from 'hooks/useModal';
import User from './components/User';
import Button, { Size, Variant } from 'components/Button';
import UpcomingCelebrationModal from './components/UpcomingCelebrationModal';
import EmptyState from './components/EmptyState';
import { useCelebrations } from 'queries/post';
import SkeletonLoader from './components/SkeletonLoader';
import { useCurrentTimezone } from 'hooks/useCurrentTimezone';
import { AuthContext } from 'contexts/AuthContext';
import { isFiltersEmpty } from 'utils/misc';

export enum CELEBRATION_TYPE {
  Birthday = 'BIRTHDAY',
  WorkAnniversary = 'WORK_ANNIVERSARY',
}

interface CelebrationWidgetProps {
  type: CELEBRATION_TYPE;
}

const CelebrationWidget: FC<CelebrationWidgetProps> = ({ type }) => {
  const { user } = useContext(AuthContext);
  const { currentTimezone } = useCurrentTimezone();
  const userTimezone = user?.timezone || currentTimezone || 'Asia/Kolkata';
  const [open, openCollpase, closeCollapse] = useModal(true, false);
  const [openUpcoming, openUpcomingModal, closeUpcomingModal] = useModal();
  const currentDate = momentTz().tz(userTimezone);
  const monthRef = useRef<any>(null);
  const thisMonthRef = useRef<any>(null);

  const isBirthday = type === CELEBRATION_TYPE.Birthday;

  const { data, isLoading, hasNextPage } = useCelebrations(
    isFiltersEmpty({
      limit: 3,
      type: isBirthday ? 'BIRTHDAY' : 'WORK_ANNIVERSARY',
    }),
  );

  const formattedData = data?.pages.flatMap((page: any) => {
    return page?.data?.result?.data.map((celebration: any) => {
      try {
        return celebration;
      } catch (e) {
        console.log('Error', { celebration });
      }
    });
  });

  const thisMonthCelebration = formattedData
    ? formattedData.filter((item) => {
        const itemDate = momentTz(item.nextOcassionDateTime).tz(userTimezone);
        if (
          itemDate.month() === currentDate.month() &&
          itemDate.year() === currentDate.year() &&
          itemDate.format('MM-DD') >= currentDate.format('MM-DD')
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

  const isAllCelebrationsDisplyed =
    (formattedData || []).length ===
    [...thisMonthCelebration, ...upcomingMonthCelebration].length;

  const widgetTitle = isBirthday ? 'Birthdays 🎂' : 'Work anniversaries 🎉';
  const buttonLabel = isBirthday
    ? 'Upcoming Birthdays'
    : 'Upcoming anniversaries';

  const toggleModal = () => {
    if (open) closeCollapse();
    else openCollpase();
  };

  return (
    <Card className="py-6 flex flex-col rounded-9xl">
      <div
        className="px-6 flex items-center justify-between cursor-pointer"
        data-testid={`collapse-${isBirthday ? 'birthday' : 'anniversaries'}`}
        onClick={toggleModal}
      >
        <div className="font-bold">{widgetTitle}</div>
        <Icon name={open ? 'arrowUp' : 'arrowDown'} size={20} />
      </div>
      <div
        className={`transition-max-h duration-300 ease-in-out overflow-hidden ${
          open ? 'max-h-[1000px]' : 'max-h-[0]'
        }`}
      >
        <div className="px-4 flex flex-col gap-4 mt-4">
          {(() => {
            if (isLoading) {
              return (
                <>
                  {[...Array(3)].map((element) => (
                    <SkeletonLoader key={element} />
                  ))}
                </>
              );
            }
            if (
              thisMonthCelebration?.length > 0 ||
              upcomingMonthCelebration.length > 0
            ) {
              return (
                <>
                  {/* This month celebration */}
                  {thisMonthCelebration.length > 0 &&
                    upcomingMonthCelebration.length > 0 && (
                      <div className="text-sm font-semibold px-2">
                        This Month
                      </div>
                    )}
                  {thisMonthCelebration.map((celebration) => (
                    <User
                      type={type}
                      key={celebration.featuredUser.userId}
                      data={celebration}
                      onSendWish={openUpcomingModal}
                    />
                  ))}

                  {/* Next Month celebration */}
                  {upcomingMonthCelebration.length > 0 && (
                    <>
                      {thisMonthCelebration.length > 0 &&
                        upcomingMonthCelebration.length > 0 && (
                          <div className="text-sm font-semibold px-2">
                            Next Month
                          </div>
                        )}
                      {upcomingMonthCelebration.map((celebration) => (
                        <User
                          type={type}
                          data={celebration}
                          key={celebration.featuredUser.userId}
                          onSendWish={openUpcomingModal}
                        />
                      ))}
                    </>
                  )}
                  {isAllCelebrationsDisplyed && hasNextPage && (
                    <Button
                      variant={Variant.Secondary}
                      size={Size.Small}
                      className="py-[7px]"
                      label={buttonLabel}
                      dataTestId={`upcoming-${
                        isBirthday ? 'birthday' : 'anniversaries'
                      }`}
                      onClick={openUpcomingModal}
                    />
                  )}
                </>
              );
            }
            return <EmptyState type={type} />;
          })()}
        </div>
      </div>
      {openUpcoming && (
        <UpcomingCelebrationModal
          open={openUpcoming}
          closeModal={closeUpcomingModal}
          type={type}
        />
      )}
    </Card>
  );
};

export default memo(CelebrationWidget);
