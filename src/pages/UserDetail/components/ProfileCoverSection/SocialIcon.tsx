import clsx from 'clsx';
import EditIconGreenOutline from 'components/Icon/components/EditGreenOutline';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  WebIcon,
} from 'components/Icon/socialIcons';
import React from 'react';
import { useParams } from 'react-router-dom';

type AppProps = {
  userDetails: Record<string, any>;
  socialLink: string;
  openModal?: () => any;
};

const socialIconMap: Record<string, any> = {
  linkedIn: LinkedinIcon,
  twitter: TwitterIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  website: WebIcon,
  edit: EditIconGreenOutline,
};

const SocialIcon: React.FC<AppProps> = ({
  userDetails,
  socialLink,
  openModal,
}) => {
  const iconValue = userDetails?.personal?.socialAccounts?.[socialLink];
  const Component = socialIconMap[socialLink];
  const { userId } = useParams();
  const isSelf = !userId;

  return (
    <div
      onClick={() => {
        if (!isSelf && iconValue) {
          window.open(iconValue, '_blank');
        }
      }}
      data-testid={`edit-${socialLink.toLowerCase()}`}
    >
      <Component
        onClick={() => isSelf && socialLink == 'edit' && openModal?.()}
        size={18}
        className={clsx({
          grayscale: !iconValue && socialLink !== 'edit',
        })}
      />
    </div>
  );
};

export default SocialIcon;
