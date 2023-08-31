import React, { useContext } from 'react';
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

export enum CELEBRATION_TYPE {
  Birthday = 'BIRTHDAY',
  WorkAnniversary = 'WORK_ANNIVERSARY',
}

interface CelebrationWidgetProps {
  type: CELEBRATION_TYPE;
}

const CelebrationWidget: React.FC<CelebrationWidgetProps> = ({ type }) => {
  const { user } = useContext(AuthContext);
  const { currentTimezone } = useCurrentTimezone();
  const userTimezone = user?.timezone || currentTimezone || 'Asia/Kolkata';
  const [open, openCollpase, closeCollapse] = useModal(true, false);
  const [openUpcoming, openUpcomingModal, closeUpcomingModal] = useModal();
  const currentDate = momentTz().tz(userTimezone);

  const { data, isLoading } = useCelebrations();

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
        const itemDate = momentTz(
          type === CELEBRATION_TYPE.Birthday ? item.dateOfBirth : item.joinDate,
        ).tz(userTimezone);
        return itemDate.month() === currentDate.month();
      })
    : [];

  const upcomingMonthCelebration = formattedData
    ? formattedData.filter((item) => {
        const itemDate = momentTz(
          type === CELEBRATION_TYPE.Birthday ? item.dateOfBirth : item.joinDate,
        ).tz(userTimezone);
        return itemDate.month() >= currentDate.month() + 1;
      })
    : [];

  const widgetTitle =
    type === CELEBRATION_TYPE.Birthday
      ? 'Birthdays 🎂'
      : 'Work anniversaries 🎉';
  const buttonLabel =
    type === CELEBRATION_TYPE.Birthday
      ? 'Upcoming Birthdays'
      : 'Upcoming anniversaries';

  const toggleModal = () => {
    if (open) closeCollapse();
    else openCollpase();
  };

  return (
    <Card className="py-6 flex flex-col rounded-9xl gap-4">
      <div
        className="px-6 flex items-center justify-between cursor-pointer"
        onClick={toggleModal}
      >
        <div className="font-bold">{widgetTitle}</div>
        <Icon name={open ? 'arrowUp' : 'arrowDown'} size={20} />
      </div>
      {open && (
        <div className="px-4 flex flex-col gap-4">
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
                    />
                  ))}

                  {/* Upcoming Month celebration */}
                  {upcomingMonthCelebration.length > 0 && (
                    <>
                      {thisMonthCelebration.length > 0 &&
                        upcomingMonthCelebration.length > 0 && (
                          <div className="text-sm font-semibold px-2">
                            Upcoming Month
                          </div>
                        )}
                      {upcomingMonthCelebration.map((celebration) => (
                        <User
                          type={type}
                          data={celebration}
                          key={celebration.featuredUser.userId}
                        />
                      ))}
                    </>
                  )}
                  <Button
                    variant={Variant.Secondary}
                    size={Size.Small}
                    className="py-[7px]"
                    label={buttonLabel}
                    onClick={openUpcomingModal}
                  />
                </>
              );
            }
            return <EmptyState type={type} />;
          })()}
        </div>
      )}
      <UpcomingCelebrationModal
        open={openUpcoming}
        closeModal={closeUpcomingModal}
        type={type}
      />
    </Card>
  );
};

export default CelebrationWidget;
