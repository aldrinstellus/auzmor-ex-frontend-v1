import React, { useMemo, useState } from 'react';
import Card from 'components/Card';
import Icon from 'components/Icon';
import Button, { Variant, Type as ButtonType } from 'components/Button';
import IconWrapper, { Type } from 'components/Icon/components/IconWrapper';
import { Size } from 'components/Button';
import useHover from 'hooks/useHover';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import { useMutation } from '@tanstack/react-query';
import { updateCurrentUser } from 'queries/users';
import queryClient from 'utils/queryClient';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { twConfig } from 'utils/misc';
import { toast } from 'react-toastify';
import CopyButton from './components/CopyButton';
import { usePhoneInput } from 'react-international-phone';

export interface IContactInfoForm {
  primaryEmail: string;
  workPhone: string;
}

type IContactCardProps = {
  contactCardData: IContactInfoForm;
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

  const { control, handleSubmit, getValues, reset } = useForm<IContactInfoForm>(
    {
      mode: 'onSubmit',
      defaultValues: {
        primaryEmail: contactCardData?.primaryEmail,
        workPhone: contactCardData?.workPhone,
      },
    },
  );

  const { phone } = usePhoneInput({
    value: contactCardData.workPhone,
  });

  const fields = [
    {
      name: 'primaryEmail',
      label: 'Primary Email',
      type: FieldType.Input,
      control,
      className: '',
      disabled: true,
      defaultValue: contactCardData.primaryEmail,
    },
    {
      name: 'workPhone',
      label: 'Contact No.',
      type: FieldType.TelephoneInput,
      control,
      inputClassName: 'bg-red-500',
      disabled: false,
      defaultValue: contactCardData.workPhone,
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
        autoClose: 2000,
      });
      setIsEditable(false);
    },
  });

  const onSubmit = async () => {
    await updateUserContactDetailMutation.mutateAsync(getValues());
    await queryClient.invalidateQueries(['current-user-me']);
    setIsEditable(false);
  };

  return (
    <div className="w-1/4">
      <div {...eventHandlers}>
        <Card className={onHoverStyles}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-4 flex items-center justify-between">
              <p className="text-neutral-900 font-bold text-base">
                Contact Info
              </p>
              {canEdit && isHovered && !isEditable ? (
                <IconWrapper
                  type={Type.Square}
                  className="cursor-pointer"
                  // dataTestId={`edit-${dataTestId}`}
                >
                  <Icon
                    name="edit"
                    size={16}
                    onClick={() => setIsEditable(!isEditable)}
                  />
                </IconWrapper>
              ) : (
                isEditable && (
                  <div className="flex space-x-3">
                    <Button
                      variant={Variant.Secondary}
                      label={'Cancel'}
                      size={Size.Small}
                      onClick={() => {
                        setIsEditable(false);
                        reset();
                      }}
                      // dataTestId={`${dataTestId}-cancel`}
                    />
                    <Button
                      label={'Save'}
                      size={Size.Small}
                      type={ButtonType.Submit}
                      // dataTestId={`${dataTestId}-save`}
                      loading={updateUserContactDetailMutation.isLoading}
                    />
                  </div>
                )
              )}
            </div>
            <div className="pt-2 px-6 pb-4 space-y-6">
              <div className="space-y-4">
                {!isEditable ? (
                  <div className="flex flex-col gap-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2 truncate items-center">
                        <IconWrapper>
                          <Icon name="email" stroke="#737373" size={15} />
                        </IconWrapper>
                        <div
                          className="text-sm font-normal text-neutral-900"
                          data-testid="user-contact-widget-email"
                        >
                          {contactCardData?.primaryEmail || 'N/A'}
                        </div>
                      </div>
                      <CopyButton content={contactCardData.primaryEmail} />
                    </div>
                    <div className="flex space-x-4 justify-between items-center">
                      <div className="flex space-x-2 truncate items-center">
                        <IconWrapper>
                          <Icon name="call" stroke="#737373" size={15} />
                        </IconWrapper>
                        <div
                          className="text-sm font-normal text-neutral-900"
                          data-testid="user-contact-widget-number"
                        >
                          {phone || 'N/A'}
                        </div>
                      </div>
                      <CopyButton content={phone} />
                    </div>
                  </div>
                ) : (
                  <div>
                    <Layout fields={fields} />
                  </div>
                )}
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
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ContactWidget;
