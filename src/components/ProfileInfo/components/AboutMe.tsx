import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import Card from 'components/Card';
import Divider from 'components/Divider';
import TextArea from 'components/TextArea';
import useHover from 'hooks/useHover';
import Header from './Header';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import queryClient from 'utils/queryClient';
import { updateCurrentUser } from 'queries/users';
import { useMutation } from '@tanstack/react-query';

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
        about: aboutMeData?.personal?.about || aboutMeData?.fullName,
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
    onError: (error: any) => {
      console.log('Error while updating the user about me section: ', error);
    },
    onSuccess: (response: any) => {
      console.log('Updated User about me successfully', response);
      setIsEditable(false);
    },
  });

  const onSubmit = async (message: Record<string, string>) => {
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
            aboutMeData?.personal?.about
          ) : (
            <Layout fields={textAreaField} />
          )}
        </div>
      </Card>
    </div>
  );
};

export default AboutMe;
