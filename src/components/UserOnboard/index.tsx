import React, { ReactElement as ReactNode, useEffect, useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import EditProfileScreen from './components/EditProfileScreen';
import SelectTimezoneScreen from './components/SelectTimezoneScreen';
import AllDoneScreen from './components/AllDoneScreen';
import useModal from 'hooks/useModal';
import Modal from 'components/Modal';
import Card from 'components/Card';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import useCarousel from 'hooks/useCarousel';

export type IScreen = {
  screen: ReactNode;
  cardText?: string;
};

const UserOnboard: React.FC = (): ReactNode => {
  const [open, openModal, closeModal] = useModal(true);
  const [currentScreen, prev, next] = useCarousel(0, 4);
  const [disableClose, setDisableClose] = useState<boolean>(false);

  const screens: IScreen[] = [
    {
      screen: <WelcomeScreen next={next} />,
    },
    {
      screen: (
        <EditProfileScreen next={next} setDisableClose={setDisableClose} />
      ),
    },
    {
      screen: (
        <SelectTimezoneScreen next={next} setDisableClose={setDisableClose} />
      ),
    },
    {
      screen: <AllDoneScreen closeModal={closeModal} />,
      cardText: `You're all set`,
    },
  ];

  // Remove the 'showOnboard' query param once the page loads.
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete('showOnboard');
    history.replaceState({}, '', url);
  }, []);

  return (
    <Modal open={open}>
      <Card>
        <div className="flex items-center justify-between m-4">
          <span className="font-extrabold text-lg">
            {screens[currentScreen].cardText || 'Profile Setup'}
          </span>
          <Icon
            className={`${
              disableClose ? 'cursor-not-allowed' : 'cursor-pointer'
            }`}
            name="close"
            fill="#000000"
            onClick={disableClose ? undefined : closeModal}
            hover={false}
          />
        </div>
        <Divider />
        <span className="flex items-center justify-center h-[500px]">
          {screens[currentScreen].screen}
        </span>
        <Divider />
      </Card>
    </Modal>
  );
};

export default UserOnboard;
