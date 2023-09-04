import React, { useContext } from 'react';
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

interface UpcomingCelebrationModalProps {
  open: boolean;
  closeModal: () => void;
  type: CELEBRATION_TYPE;
}

const UpcomingCelebrationModal: React.FC<UpcomingCelebrationModalProps> = ({
  open,
  closeModal,
  type,
}) => {
  const { user } = useContext(AuthContext);
  const { currentTimezone } = useCurrentTimezone();
  const userTimezone = user?.timezone || currentTimezone || 'Asia/Kolkata';
  const { data, isLoading } = useCelebrations();
  const currentDate = momentTz().tz(userTimezone);
  const isBirthday = type === CELEBRATION_TYPE.Birthday;

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
          isBirthday ? item.dateOfBirth : item.joinDate,
        ).tz(userTimezone);
        return itemDate.month() === currentDate.month();
      })
    : [];

  const upcomingMonthCelebration = formattedData
    ? formattedData.filter((item) => {
        const itemDate = momentTz(
          isBirthday ? item.dateOfBirth : item.joinDate,
        ).tz(userTimezone);
        return itemDate.month() >= currentDate.month() + 1;
      })
    : [];

  const modalTitle =
    type === CELEBRATION_TYPE.Birthday
      ? 'Upcoming birthdays 🎂'
      : 'Upcoming work anniversaries 🎉';
  return (
    <Modal open={open} closeModal={closeModal} className="max-w-[648px]">
      <Header title={modalTitle} onClose={closeModal} />
      <div className="max-h-[390px] overflow-y-auto px-6 w-full">
        {(() => {
          if (isLoading) {
            return (
              <>
                {[...Array(3)].map((element) => (
                  <div key={element} className="py-4">
                    <SkeletonLoader />
                  </div>
                ))}
              </>
            );
          }
          if (formattedData && formattedData.length > 0) {
            return (
              <>
                {/* This month celebration */}
                {thisMonthCelebration.length > 0 &&
                  upcomingMonthCelebration.length > 0 && (
                    <div className="text-sm font-semibold px-2 mt-4">
                      This Month
                    </div>
                  )}
                {thisMonthCelebration.map((celebration) => (
                  <div
                    className="py-4 border-b border-neutral-200"
                    key={celebration.featuredUser.userId}
                  >
                    <User type={type} data={celebration} isModalView />
                  </div>
                ))}

                {/* Upcoming Month celebration */}
                {upcomingMonthCelebration.length > 0 && (
                  <>
                    {thisMonthCelebration.length > 0 &&
                      upcomingMonthCelebration.length > 0 && (
                        <div className="text-sm font-semibold px-2 mt-4">
                          Upcoming Month
                        </div>
                      )}
                    {upcomingMonthCelebration.map((celebration) => (
                      <div
                        className="py-4"
                        key={celebration.featuredUser.userId}
                      >
                        <User type={type} data={celebration} isModalView />
                      </div>
                    ))}
                  </>
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
