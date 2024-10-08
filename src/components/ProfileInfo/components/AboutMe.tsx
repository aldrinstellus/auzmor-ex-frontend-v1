import { FC, Fragment, useEffect, useState } from 'react';
import Card from 'components/Card';
import useHover from 'hooks/useHover';
import Header from './Header';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import queryClient from 'utils/queryClient';
import { EditUserSection } from 'interfaces';
import { useMutation } from '@tanstack/react-query';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import Icon from 'components/Icon';
import IconWrapper, { Type } from 'components/Icon/components/IconWrapper';
import { useTranslation } from 'react-i18next';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

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

const AboutMe: FC<IAboutMeProps> = ({
  aboutMeData,
  canEdit,
  editSection,
  setSearchParams,
  searchParams,
}) => {
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isHovered, eventHandlers] = useHover();
  const { t } = useTranslation('profile');
  const { getApi } = usePermissions();

  const { control, handleSubmit, getValues, reset } = useForm<IUpdateAboutMe>({
    mode: 'onSubmit',
    defaultValues: {
      personal: {
        about: aboutMeData?.personal?.about || '',
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

  // const onHoverStyles = useMemo(
  //   () =>
  //     clsx({ 'shadow-lg': isHovered && canEdit }, { 'transition-all': true }),
  //   [isHovered],
  // );

  const textAreaField = [
    {
      type: FieldType.TextArea,
      name: 'personal.about',
      placeholder: 'Write here',
      dataTestId: 'bio-edit-text',
      control,
      defaultValue: getValues('personal.about') || '',
      className: 'w-full rounded-9xl',
      rows: 8,
      maxLength: 2000,
      showCounter: true,
    },
  ];

  const updateCurrentUser = getApi(ApiEnum.UpdateMe);
  const updateUserAboutMeMutation = useMutation({
    mutationFn: (payload: Record<string, any>) => updateCurrentUser(payload),
    mutationKey: ['update-user-personal-details-mutation'],
    onError: (_error: any) => {},
    onSuccess: (_response: any) => {
      successToastConfig({});
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
        <Fragment key={index}>
          {beforeText}
          <a
            href={match}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0000EE' }}
          >
            {linkText}
          </a>
        </Fragment>,
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
    <>
      <Header
        title={canEdit ? t('aboutMe.titleForSelf') : t('aboutMe.titleForOther')}
        dataTestId="bio"
        isHovered={isHovered && canEdit}
        // isEditable={isEditable}
        setIsEditable={setIsEditable}
        canEdit={false}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        isLoading={updateUserAboutMeMutation.isLoading}
        reset={reset}
      />
      <div {...eventHandlers}>
        <Card shadowOnHover={canEdit}>
          <div className="text-neutral-900 text-sm font-normal px-4 pb-4">
            {!isEditable ? (
              <div
                className="whitespace-pre-wrap relative pt-4"
                data-testid="bio-description"
              >
                {canEdit && isHovered && (
                  <div className="absolute right-0 top-4">
                    <Icon
                      name="edit"
                      size={16}
                      onClick={() => setIsEditable(!isEditable)}
                      dataTestId="edit-bio"
                    />
                  </div>
                )}
                {renderContentWithLinks(aboutMeData?.personal?.about) ||
                  t('fieldNotSpecified')}
              </div>
            ) : (
              <div className="relative pt-2" key={aboutMeData?.id}>
                <Layout fields={textAreaField} />
                <div className="flex justify-end mt-2">
                  <IconWrapper
                    type={Type.Circle}
                    className="!p-2 mr-2"
                    onClick={() => {
                      setIsEditable(false);
                      reset();
                    }}
                    dataTestId="cancel-bio"
                  >
                    <Icon name="close" size={16} color="text-neutral-900" />
                  </IconWrapper>
                  <IconWrapper
                    type={Type.Circle}
                    className="bg-primary-500 !p-2"
                    onClick={handleSubmit(onSubmit)}
                    dataTestId="save-bio"
                  >
                    <Icon name="check" size={16} color="text-white" />
                  </IconWrapper>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
};

export default AboutMe;
