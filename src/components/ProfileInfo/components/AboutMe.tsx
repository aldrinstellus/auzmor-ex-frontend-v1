import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import Card from 'components/Card';
import Divider from 'components/Divider';
import useHover from 'hooks/useHover';
import Header from './Header';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import queryClient from 'utils/queryClient';
import { EditUserSection, updateCurrentUser } from 'queries/users';
import { useMutation } from '@tanstack/react-query';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { toast } from 'react-toastify';
import { twConfig } from 'utils/misc';
import Icon from 'components/Icon';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import IconWrapper, { Type } from 'components/Icon/components/IconWrapper';

interface IAboutMe {
  about: string;
}
export interface IUpdateAboutMe {
  personal: IAboutMe;
}
export interface IAboutMeProps {
  aboutMeData: Record<string, any>;
  canEdit?: boolean;
  editSection?: string;
  setSearchParams?: any;
  searchParams?: any;
}

const AboutMe: React.FC<IAboutMeProps> = ({
  aboutMeData,
  canEdit,
  editSection,
  setSearchParams,
  searchParams,
}) => {
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isHovered, eventHandlers] = useHover();

  const { control, handleSubmit, getValues, watch, reset } =
    useForm<IUpdateAboutMe>({
      mode: 'onSubmit',
      defaultValues: {
        personal: {
          about: aboutMeData?.personal?.about || 'Field not specified',
        },
      },
    });

  useEffect(() => {
    if (editSection === EditUserSection.ABOUT && canEdit) {
      setIsEditable(true);
    }
  }, [editSection]);

  useEffect(() => {
    if (!isEditable && searchParams.has('edit')) {
      searchParams.delete('edit');
      setSearchParams(searchParams);
    }
  }, [isEditable]);

  const onHoverStyles = useMemo(
    () => clsx({ '': true }, { 'shadow-xl': isHovered && canEdit }),
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
      className: 'w-full rounded-9xl',
      rows: 8,
      maxLength: 2000,
      showCounter: true,
    },
  ];

  const updateUserAboutMeMutation = useMutation({
    mutationFn: updateCurrentUser,
    mutationKey: ['update-user-personal-details-mutation'],
    onError: (error: any) => {},
    onSuccess: (response: any) => {
      toast(<SuccessToast content={'User Profile Updated Successfully'} />, {
        closeButton: (
          <Icon name="closeCircleOutline" color="text-primary-500" size={20} />
        ),
        style: {
          border: `1px solid ${twConfig.theme.colors.primary['300']}`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
        },
        autoClose: TOAST_AUTOCLOSE_TIME,
        transition: slideInAndOutTop,
        theme: 'dark',
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
    // if (!message?.personal?.about) {
    //   return;
    // }
    await updateUserAboutMeMutation.mutateAsync(message);
    await queryClient.invalidateQueries(['current-user-me']);
    setIsEditable(false);
  };

  return (
    <div {...eventHandlers}>
      <Header
        title={isEditable ? 'About Me' : 'About'}
        dataTestId="about-me"
        isHovered={isHovered}
        // isEditable={isEditable}
        setIsEditable={setIsEditable}
        canEdit={false}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        isLoading={updateUserAboutMeMutation.isLoading}
        reset={reset}
      />
      <Card className={onHoverStyles}>
        <div className="text-neutral-900 text-sm font-normal px-4 pb-4">
          {!isEditable ? (
            <div
              className="whitespace-pre-wrap relative pt-4"
              data-testid="aboutme-description"
            >
              {canEdit && isHovered && (
                <div className="absolute right-0 top-4">
                  <Icon
                    name="edit"
                    size={16}
                    onClick={() => setIsEditable(!isEditable)}
                    dataTestId="edit-about-me"
                  />
                </div>
              )}
              {renderContentWithLinks(aboutMeData?.personal?.about) ||
                'Field not specified'}
            </div>
          ) : (
            <div className="relative pt-2">
              <Layout fields={textAreaField} />
              <div className="flex justify-end mt-2">
                <IconWrapper
                  type={Type.Circle}
                  className="!p-2 mr-2"
                  onClick={() => {
                    setIsEditable(false);
                    reset();
                  }}
                >
                  <Icon name="close" size={16} color="text-neutral-900" />
                </IconWrapper>
                <IconWrapper
                  type={Type.Circle}
                  className="bg-primary-500 !p-2"
                  onClick={handleSubmit(onSubmit)}
                >
                  <Icon name="check" size={16} color="text-white" />
                </IconWrapper>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AboutMe;
