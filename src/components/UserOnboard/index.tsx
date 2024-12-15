import {
  FC,
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
import { clearInputValue, getBlobUrl } from 'utils/misc';
import { EntityType } from 'interfaces';
import useAuth from 'hooks/useAuth';
import { useTranslation } from 'react-i18next';

export type IScreen = {
  screen: ReactNode;
  cardText?: string;
};

const UserOnboard: FC = (): ReactNode => {
  const { t } = useTranslation('components', {
    keyPrefix: 'userOnboard',
  });

  const { showOnboard } = useAuth();
  const [file, setFile] = useState<File>();
  const [open, openModal, closeModal] = useModal(true);
  const [currentScreen, _, next] = useCarousel(0, 5);
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
      cardText: t('allSetCardText'),
    },
  ];

  // Remove the 'showOnboard' query param once the page loads.
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete('showOnboard');
    history.replaceState({}, '', url);
  }, []);
  if (!showOnboard) return <></>;

  return (
    <div>
      <Modal open={open}>
        <Card>
          <div className="flex items-center justify-between m-4">
            <span className="font-extrabold text-lg">
              {screens[currentScreen].cardText || t('profileSetup')}
            </span>
            <div data-testid={`profile-setup-close`}>
              <Icon
                className={`${
                  disableClose ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
                name="close"
                color="text-black"
                onClick={disableClose ? undefined : closeModal}
                size={20}
              />
            </div>
          </div>
          <Divider />
          <span className="flex items-center justify-center h-[500px]">
            {screens[currentScreen].screen}
          </span>
        </Card>
      </Modal>
      <input
        id="file-input-onboarding"
        type="file"
        className="hidden"
        ref={profilePictureRef}
        accept="image/*"
        data-testid="profilepic-upload"
        multiple={false}
        onClick={clearInputValue}
        onChange={(e) => {
          if (e.target.files?.length) {
            setFile(Array.prototype.slice.call(e.target.files)[0]);
            openEditImageModal();
          }
        }}
        aria-label="profile picture"
      />
      {openEditImage && file && (
        <EditImageModal
          title={t('applyChangeTitle')}
          openEditImage={openEditImage}
          openEditProfileModal={openModal}
          closeEditImageModal={closeEditImageModal}
          userProfileImageRef={profilePictureRef}
          image={getBlobUrl(file)}
          onBoardImageFile={file}
          imageFile={file}
          imageName={file?.name}
          fileEntityType={EntityType?.UserProfileImage}
        />
      )}
    </div>
  );
};

export default UserOnboard;
