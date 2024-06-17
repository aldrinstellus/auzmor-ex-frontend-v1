import { FC, useState } from 'react';
import Card from 'components/Card';
import Icon from 'components/Icon';
import Button, { Variant, Type as ButtonType } from 'components/Button';
import IconWrapper, { Type } from 'components/Icon/components/IconWrapper';
import { Size } from 'components/Button';
import useHover from 'hooks/useHover';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import { useMutation } from '@tanstack/react-query';
import { updateCurrentUser } from 'queries/users';
import queryClient from 'utils/queryClient';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import CopyButton from './components/CopyButton';

export interface IContactInfoForm {
  primaryEmail: string;
  workPhone: string;
}

type IContactCardProps = {
  contactCardData: IContactInfoForm;
  canEdit: boolean;
};

const ContactWidget: FC<IContactCardProps> = ({ contactCardData, canEdit }) => {
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isHovered, eventHandlers] = useHover();

  const { control, handleSubmit, getValues, reset } = useForm<IContactInfoForm>(
    {
      mode: 'onSubmit',
      defaultValues: {
        primaryEmail: contactCardData?.primaryEmail,
        workPhone: contactCardData?.workPhone,
      },
    },
  );

  const phoneValue = contactCardData?.workPhone;

  const fields = [
    {
      name: 'primaryEmail',
      label: 'Primary Email',
      type: FieldType.Input,
      control,
      className: '',
      disabled: true,
      dataTestId: 'contact-info-email',
      defaultValue: contactCardData?.primaryEmail,
    },
    {
      name: 'workPhone',
      label: 'Contact No.',
      type: FieldType.TelephoneInput,
      control,
      inputClassName: 'bg-red-500',
      disabled: false,
      dataTestId: 'contact-info',
      defaultValue: contactCardData?.workPhone,
    },
  ];

  const updateUserContactDetailMutation = useMutation({
    mutationFn: updateCurrentUser,
    mutationKey: ['update-user-contact-detail-mutation'],
    onError: (_error: any) => {},
    onSuccess: (_response: any) => {
      successToastConfig({ message: 'User Profile Updated Successfully' });
      setIsEditable(false);
    },
  });

  const onSubmit = async () => {
    await updateUserContactDetailMutation.mutateAsync(getValues());
    await queryClient.invalidateQueries(['current-user-me']);
    setIsEditable(false);
  };

  return (
    <div>
      <div {...eventHandlers}>
        <Card shadowOnHover={canEdit} dataTestId="contactinfo-card">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="flex items-center justify-between">
              <p
                className="text-neutral-900 font-bold text-base"
                data-testid="user-contact-details"
              >
                Contact Info
              </p>
              {canEdit && isHovered && !isEditable ? (
                <IconWrapper
                  type={Type.Square}
                  className="cursor-pointer h-[24px] w-[24px]["
                  dataTestId={`contact-info-edit`}
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
                      dataTestId={`contact-info-cancel`}
                    />
                    <Button
                      label={'Save'}
                      size={Size.Small}
                      type={ButtonType.Submit}
                      dataTestId={`contact-info-save`}
                      loading={updateUserContactDetailMutation.isLoading}
                    />
                  </div>
                )
              )}
            </div>
            <div className="pt-4 pb-2 space-y-6">
              <div className="space-y-4">
                {!isEditable ? (
                  <div className="flex flex-col gap-y-4">
                    <div className="flex justify-between items-center group/item">
                      <div className="flex space-x-2 truncate items-center">
                        <IconWrapper className="rounded-6xl p-[3px]">
                          <Icon name="email" hover={false} size={16} />
                        </IconWrapper>
                        <div
                          className="text-sm font-normal text-neutral-900"
                          data-testid="user-contact-widget-email"
                        >
                          {contactCardData?.primaryEmail || '-'}
                        </div>
                      </div>
                      <CopyButton
                        content={contactCardData?.primaryEmail}
                        dataTestId="contact-info-copy-email"
                        className="hidden group-hover/item:block"
                      />
                    </div>
                    <div className="flex space-x-4 justify-between items-center group/item">
                      <div className="flex space-x-2 truncate items-center">
                        <IconWrapper className="rounded-6xl p-[3px]">
                          <Icon name="call" hover={false} size={16} />
                        </IconWrapper>
                        <div
                          className="text-sm font-normal text-neutral-900"
                          data-testid="user-contact-widget-number"
                        >
                          {phoneValue || '-'}
                        </div>
                      </div>
                      {phoneValue && (
                        <CopyButton
                          content={phoneValue}
                          dataTestId="contact-info-copy-number"
                          className="hidden group-hover/item:block"
                        />
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <Layout fields={fields} />
                  </div>
                )}
                {/* <div className="flex justify-center items-center w-full">
                  <Button
                    label="View Organization Chart"
                    variant={Variant.Secondary}
                    className="space-x-1 font-bold w-full"
                    leftIcon="connectionFolder"
                    size={Size.Small}
                    disabled
                    dataTestId="user-view-org-chart"
                  />
                </div> */}
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ContactWidget;
