import Card from 'components/Card';
import Icon from 'components/Icon';
import useModal from 'hooks/useModal';
import React from 'react';
import User from './components/User';
import Button, { Size, Variant } from 'components/Button';
import UpcomingCelebrationModal from './components/UpcomingCelebrationModal';

export enum CELEBRATION_TYPE {
  Birthday = 'BIRTHDAY',
  WorkAnniversary = 'WORK_ANNIVERSARY',
}

interface CelebrationWidgetProps {
  type: CELEBRATION_TYPE;
}

const CelebrationWidget: React.FC<CelebrationWidgetProps> = ({ type }) => {
  const [open, openCollpase, closeCollapse] = useModal(true, false);
  const [openUpcoming, openUpcomingModal, closeUpcomingModal] = useModal();

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
          <User type={type} />
          <User type={type} />
          <Button
            variant={Variant.Secondary}
            size={Size.Small}
            className="py-[7px]"
            label={buttonLabel}
            onClick={openUpcomingModal}
          />
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
