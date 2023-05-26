import React, { useMemo, useState } from 'react';
import Card from 'components/Card';
import Icon from 'components/Icon';
import Button, { Variant } from 'components/Button';
import { Variant as InputVariant } from 'components/Input';
import IconWrapper from 'components/Icon/components/IconWrapper';
import { Size } from 'components/Button';
import useHover from 'hooks/useHover';
import clsx from 'clsx';
import Header from 'components/ProfileInfo/components/Header';
import { useForm } from 'react-hook-form';
import Divider from 'components/Divider';
import Layout, { FieldType } from 'components/Form';
import { useMutation } from '@tanstack/react-query';
import { updateCurrentUser } from 'queries/users';
import queryClient from 'utils/queryClient';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { twConfig } from 'utils/misc';
import { toast } from 'react-toastify';

export interface IContactInfoForm {
  primaryEmail: string;
  workPhone: string;
}

type IContactCardProps = {
  contactCardData: any;
  canEdit: boolean;
};

const ContactWidget: React.FC<IContactCardProps> = ({
  contactCardData,
  canEdit,
}) => {
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isHovered, eventHandlers] = useHover();

  const onHoverStyles = useMemo(
    () => clsx({ 'shadow-xl': isHovered && canEdit }),
    [isHovered],
  );

  const { control, handleSubmit, getValues } = useForm<IContactInfoForm>({
    mode: 'onSubmit',
    defaultValues: {
      primaryEmail: contactCardData?.primaryEmail,
      workPhone: contactCardData?.workPhone,
    },
  });

  const emailField = [
    {
      name: 'primaryEmail',
      label: 'Primary Email:',
      type: FieldType.Input,
      defaultValue: getValues().primaryEmail,
      control,
      className: '',
      disabled: true,
    },
  ];

  const phoneField = [
    {
      name: 'workPhone',
      type: FieldType.Input,
      defaultValue: getValues().workPhone,
      variant: InputVariant.Tel,
      control,
    },
  ];

  const countryCodeField = [
    {
      name: 'countryCode',
      type: FieldType.SingleSelect,
      defaultValue: '+91',
      control,
      options: [{ value: '+91', label: '+91' }],
    },
  ];

  const updateUserContactDetailMutation = useMutation({
    mutationFn: updateCurrentUser,
    mutationKey: ['update-user-contact-detail-mutation'],
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

  const onSubmit = async (contactDetails: any) => {
    await updateUserContactDetailMutation.mutateAsync(contactDetails);
    await queryClient.invalidateQueries(['current-user-me']);
    setIsEditable(false);
  };

  return (
    <div className="w-1/4">
      <div {...eventHandlers}>
        <Card className={onHoverStyles}>
          <Header
            title="Contact Info"
            dataTestId="user-contact-info"
            isHovered={isHovered}
            isEditable={isEditable}
            setIsEditable={setIsEditable}
            canEdit={canEdit}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            isLoading={updateUserContactDetailMutation.isLoading}
          />
          <div className="pt-2 px-6 pb-4 space-y-6">
            <div className="space-y-4">
              {!isEditable ? (
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2 truncate items-center">
                    <IconWrapper>
                      <Icon name="email" stroke="#737373" size={15} />
                    </IconWrapper>
                    <div
                      className="text-xs font-normal text-neutral-900"
                      data-testid="user-contact-widget-email"
                    >
                      {contactCardData?.primaryEmail || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <Icon
                      name="copyIcon"
                      size={16}
                      onClick={() => {
                        navigator.clipboard.writeText(
                          contactCardData?.primaryEmail,
                        );
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <Layout fields={emailField} />
                </div>
              )}

              {!isEditable ? (
                <div className="flex space-x-4">
                  <div className="flex space-x-2 truncate items-center">
                    <IconWrapper>
                      <Icon name="call" stroke="#737373" size={15} />
                    </IconWrapper>{' '}
                    <div
                      className="text-xs font-normal text-neutral-900"
                      data-testid="user-contact-widget-number"
                    >
                      {contactCardData?.workPhone || 'N/A'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Layout fields={countryCodeField} />
                  <Layout fields={phoneField} className="w-full" />
                </div>
              )}
            </div>
            {/* Button */}
            <div className="flex justify-center items-center">
              <Button
                label="View Organization Chart"
                variant={Variant.Secondary}
                className="space-x-1 font-bold"
                leftIcon="connectionFolder"
                size={Size.Small}
                dataTestId="user-view-org-chart"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ContactWidget;
