import React, {
  ReactElement as ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
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
import EditImageModal from 'components/EditImageModal';
import { getBlobUrl } from 'utils/misc';
import { EntityType } from 'queries/files';

export type IScreen = {
  screen: ReactNode;
  cardText?: string;
};

const UserOnboard: React.FC = (): ReactNode => {
  const [file, setFile] = useState<File>();
  const [open, openModal, closeModal] = useModal(true);
  const [currentScreen, prev, next] = useCarousel(0, 5);
  const [disableClose, setDisableClose] = useState<boolean>(false);
  const [openEditImage, openEditImageModal, closeEditImageModal] =
    useModal(false);
  const profilePictureRef = useRef<HTMLInputElement>(null);

  const screens: IScreen[] = [
    {
      screen: <WelcomeScreen next={next} dataTestId="user-welcome-next" />,
    },
    {
      screen: (
        <EditProfileScreen
          next={next}
          setDisableClose={setDisableClose}
          dataTestId="edit-profilepic-next"
          profilePictureRef={profilePictureRef}
        />
      ),
    },
    {
      screen: (
        <SelectTimezoneScreen
          next={next}
          setDisableClose={setDisableClose}
          dataTestId="select-timezone"
        />
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
    <div>
      <Modal open={open}>
        <Card>
          <div className="flex items-center justify-between m-4">
            <span className="font-extrabold text-lg">
              {screens[currentScreen].cardText || 'Profile Setup'}
            </span>
            <div data-testid={`profile-setup-close`}>
              <Icon
                className={`${
                  disableClose ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
                name="close"
                fill="#000000"
                onClick={disableClose ? undefined : closeModal}
                hover={false}
                size={20}
              />
            </div>
          </div>
          <Divider />
          <span className="flex items-center justify-center h-[500px]">
            {screens[currentScreen].screen}
          </span>
          <Divider />
        </Card>
      </Modal>
      <input
        id="file-input"
        type="file"
        className="hidden"
        ref={profilePictureRef}
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.length) {
            setFile(Array.prototype.slice.call(e.target.files)[0]);
            openEditImageModal();
            closeModal();
          }
        }}
      />
      {openEditImage && file && (
        <EditImageModal
          title="Apply Change"
          openEditImage={openEditImage}
          openEditProfileModal={openModal}
          closeEditImageModal={closeEditImageModal}
          userProfileImageRef={profilePictureRef}
          image={getBlobUrl(file)}
          onBoardImageFile={file}
          imageName={file?.name}
          fileEntityType={EntityType?.UserProfileImage}
        />
      )}
    </div>
  );
};

export default UserOnboard;
