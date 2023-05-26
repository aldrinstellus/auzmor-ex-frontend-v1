import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import Card from 'components/Card';
import Divider from 'components/Divider';
import useHover from 'hooks/useHover';
import Header from './Header';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import queryClient from 'utils/queryClient';
import { updateCurrentUser } from 'queries/users';
import { useMutation } from '@tanstack/react-query';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { toast } from 'react-toastify';
import { twConfig } from 'utils/misc';
import Icon from 'components/Icon';

interface IAboutMe {
  about: string;
}
export interface IUpdateAboutMe {
  personal: IAboutMe;
}
export interface IAboutMeProps {
  aboutMeData: Record<string, any>;
  canEdit?: boolean;
}

const AboutMe: React.FC<IAboutMeProps> = ({ aboutMeData, canEdit }) => {
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isHovered, eventHandlers] = useHover();

  const { control, handleSubmit, getValues } = useForm<IUpdateAboutMe>({
    mode: 'onSubmit',
    defaultValues: {
      personal: {
        about: aboutMeData?.personal?.about || 'N/A',
      },
    },
  });

  const onHoverStyles = useMemo(
    () => clsx({ 'mb-8': true }, { 'shadow-xl': isHovered && canEdit }),
    [isHovered],
  );

  const textAreaField = [
    {
      type: FieldType.TextArea,
      name: 'personal.about',
      placeholder: 'write here',
      defaultValue: getValues()?.personal?.about,
      dataTestId: 'about-me-edit-text',
      control,
      className: 'w-full',
      rows: 3,
      maxLength: 2000,
      showCounter: false,
    },
  ];

  const updateUserAboutMeMutation = useMutation({
    mutationFn: updateCurrentUser,
    mutationKey: ['update-user-personal-details-mutation'],
    onError: (error: any) => {},
    onSuccess: (response: any) => {
      toast(<SuccessToast content={'User Profile Updated Successfully'} />, {
        closeButton: (
          <Icon
            name="closeCircleOutline"
            stroke={twConfig.theme.colors.primary['500']}
            size={20}
          />
        ),
        style: {
          border: `1px solid ${twConfig.theme.colors.primary['300']}`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
        },
      });
      setIsEditable(false);
    },
  });

  const renderContentWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text?.match(urlRegex);
    if (!matches) {
      return text;
    }
    const elements = [];
    let lastIndex = 0;
    matches?.forEach((match: any, index: any) => {
      const startIndex = text?.indexOf(match, lastIndex);
      const endIndex = startIndex + match?.length;
      const beforeText = text?.substring(lastIndex, startIndex);
      const linkText = match;
      elements.push(
        <React.Fragment key={index}>
          {beforeText}
          <a
            href={match}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0000EE' }}
          >
            {linkText}
          </a>
        </React.Fragment>,
      );

      lastIndex = endIndex;
    });
    elements.push(text?.substring(lastIndex));
    return elements;
  };

  const onSubmit = async () => {
    const message = getValues();
    if (!message?.personal?.about) {
      return;
    }
    await updateUserAboutMeMutation.mutateAsync(message);
    await queryClient.invalidateQueries(['current-user-me']);
    setIsEditable(false);
  };

  return (
    <div {...eventHandlers}>
      <Card className={onHoverStyles}>
        <Header
          title="About Me"
          dataTestId="about-me"
          isHovered={isHovered}
          isEditable={isEditable}
          setIsEditable={setIsEditable}
          canEdit={canEdit}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          isLoading={updateUserAboutMeMutation.isLoading}
        />
        <Divider />
        <div className="text-neutral-900 text-sm font-normal pt-4 pb-6 px-6">
          {!isEditable ? (
            <div className="whitespace-pre-wrap">
              {renderContentWithLinks(aboutMeData?.personal?.about) || 'N/A'}
            </div>
          ) : (
            <Layout fields={textAreaField} />
          )}
        </div>
      </Card>
    </div>
  );
};

export default AboutMe;
