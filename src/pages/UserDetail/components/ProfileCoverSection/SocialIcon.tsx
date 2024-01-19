import clsx from 'clsx';
import Icon from 'components/Icon';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  WebIcon,
} from 'components/Icon/socialIcons';
import useHover from 'hooks/useHover';
import React from 'react';
import { useParams } from 'react-router-dom';

type AppProps = {
  userDetails: Record<string, any>;
  socialLink: string;
};

const socialIconMap: Record<string, any> = {
  linkedIn: LinkedinIcon,
  twitter: TwitterIcon,
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  website: WebIcon,
};

const SocialIcon: React.FC<AppProps> = ({ userDetails, socialLink }) => {
  const iconValue = userDetails?.personal?.socialAccounts?.[socialLink];
  const Component = socialIconMap[socialLink];
  const [isHovered, hoverEvents] = useHover();
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
      {...hoverEvents}
    >
      {isSelf && isHovered ? (
        <div className="p-[3px] bg-primary-500 grayscale rounded-full">
          <Icon
            name="edit"
            className="text-white !hover:text-white !group-hover:text-white"
            hoverColor="text-white"
            hover={false}
          />
        </div>
      ) : (
        <Component
          size={18}
          className={clsx({
            grayscale: !iconValue,
          })}
        />
      )}
    </div>
  );
};

export default SocialIcon;
