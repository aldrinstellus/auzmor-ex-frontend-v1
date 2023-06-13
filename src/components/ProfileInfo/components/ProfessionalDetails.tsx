import React, { useMemo, useState } from 'react';
import Card from 'components/Card';
import Divider from 'components/Divider';
import useHover from 'hooks/useHover';
import clsx from 'clsx';
import Icon from 'components/Icon';
import moment from 'moment';
import * as yup from 'yup';
import 'moment-timezone';
import IconWrapper, { Type } from 'components/Icon/components/IconWrapper';
import Header from './Header';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import SelectTimeZone from 'components/UserOnboard/components/SelectTimeZone';
import { OptionType } from 'components/UserOnboard/components/SelectTimezoneScreen';
import { useMutation } from '@tanstack/react-query';
import { updateCurrentUser } from 'queries/users';
import { getDefaultTimezoneOption } from 'components/UserOnboard/utils';
import queryClient from 'utils/queryClient';
import SuccessToast from 'components/Toast/variants/SuccessToast';
import { toast } from 'react-toastify';
import { twConfig } from 'utils/misc';
import { getTimezoneNameFromIANA } from 'utils/time';

interface IForm {
  timeZone: OptionType;
}
export interface IProfessionalDetailsProps {
  professionalDetails: any;
  canEdit?: boolean;
}

const ProfessionalDetails: React.FC<IProfessionalDetailsProps> = ({
  professionalDetails,
  canEdit,
}) => {
  const [isHovered, eventHandlers] = useHover();
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const defaultTimezone = getDefaultTimezoneOption();

  const schema = yup.object({
    timeZone: yup.object(),
  });

  const { handleSubmit, control, getValues } = useForm<any>({
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const onHoverStyles = useMemo(
    () => clsx({ 'mb-8': true }, { 'shadow-xl': isHovered && canEdit }),
    [isHovered],
  );

  const updateUserTimezoneMutation = useMutation({
    mutationFn: updateCurrentUser,
    mutationKey: ['update-user-timeZone-mutation'],
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
    const selectedTimezone = getValues();
    let timezoneValue;
    if (selectedTimezone.timeZone === undefined) {
      timezoneValue = defaultTimezone.value[0];
    } else {
      timezoneValue = selectedTimezone.timeZone.value[0];
    }
    await updateUserTimezoneMutation.mutateAsync({
      timeZone: timezoneValue,
    });
    await queryClient.invalidateQueries(['current-user-me']);
    setIsEditable(false);
  };

  const userTimezone = getTimezoneNameFromIANA(professionalDetails?.timeZone);

  return (
    <div {...eventHandlers}>
      <Card className={onHoverStyles}>
        <Header
          title="Professional Details"
          dataTestId="professional-details"
          isHovered={isHovered}
          isEditable={isEditable}
          setIsEditable={setIsEditable}
          canEdit={canEdit}
          onSubmit={onSubmit}
          handleSubmit={handleSubmit}
          isLoading={updateUserTimezoneMutation.isLoading}
        />
        <Divider />
        <form>
          <div className="py-6 space-y-6 px-6">
            <div className="space-y-2">
              <div className="text-neutral-500 text-sm font-bold">
                Date of Joining
              </div>
              <div className="flex space-x-3">
                <IconWrapper type={Type.Square}>
                  <Icon name="clock" size={16} />
                </IconWrapper>
                <div className="text-neutral-900 text-base font-medium">
                  Joined on{' '}
                  <span data-testid="professional-details-joining-date">
                    {moment(professionalDetails?.createdAt).format(
                      'Do MMMM YYYY',
                    ) || 'N//A'}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-neutral-500 text-sm font-bold">Timezone</div>
              {isEditable ? (
                <SelectTimeZone
                  control={control}
                  defaultTimezone={{
                    value: professionalDetails?.timeZone,
                    label: userTimezone,
                  }}
                  placeholder="Select your timezone"
                  dataTestId="professional-details-timezone"
                />
              ) : (
                <div className="flex space-x-3">
                  <IconWrapper type={Type.Square}>
                    <Icon name="clock" size={16} />
                  </IconWrapper>
                  <div
                    className="text-neutral-900 text-base font-medium"
                    data-testid="user-timezone"
                  >
                    {userTimezone || 'N/A'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProfessionalDetails;
