import React, { useRef } from 'react';
import * as yup from 'yup';
import InfoRow from '../InfoRow';
import SelectTimeZone from 'components/UserOnboard/components/SelectTimeZone';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getTimezoneNameFromIANA } from 'utils/time';
import { updateCurrentUser } from 'queries/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Icon from 'components/Icon';
import { twConfig } from 'utils/misc';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { slideInAndOutTop } from 'utils/react-toastify';
import { getDefaultTimezoneOption } from 'components/UserOnboard/utils';
import { toastConfig } from '../utils';

type AppProps = {
  data: any;
};

const TimezoneRow: React.FC<AppProps> = ({ data }) => {
  const queryClient = useQueryClient();
  const defaultTimezone = getDefaultTimezoneOption();
  const ref = useRef<any>(null);

  const schema = yup.object({
    timeZone: yup.object(),
  });

  const updateUserTimezoneMutation = useMutation({
    mutationFn: updateCurrentUser,
    mutationKey: ['update-user-timeZone-mutation'],
    onError: (error: any) => {},
    onSuccess: async (response: any) => {
      toastConfig(
        <Icon
          name="closeCircleOutline"
          color={twConfig.theme.colors.primary['500']}
          size={20}
        />,
      );
      ref?.current?.setEditMode(false);
      await queryClient.invalidateQueries(['current-user-me']);
    },
  });

  const { handleSubmit, control, reset, getValues } = useForm<any>({
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const onSubmit = () => {
    const selectedTimezone = getValues();
    const timezoneValue =
      selectedTimezone.timeZone?.value[0] ||
      data?.timeZone ||
      defaultTimezone.value[0];
    updateUserTimezoneMutation.mutate({
      timeZone: timezoneValue,
    });
  };

  const userTimezone = getTimezoneNameFromIANA(data?.timeZone);

  return (
    <InfoRow
      icon={{
        name: 'clock',
        color: '!text-blue-500',
        bgColor: '!bg-blue-50',
      }}
      ref={ref}
      label="Timezone"
      value={userTimezone}
      dataTestId="professional-details-timezone"
      border={false}
      editNode={
        <SelectTimeZone
          control={control}
          defaultTimezone={{
            value: data?.timeZone,
            label: userTimezone,
          }}
          placeholder="Select your timezone"
          dataTestId="professional-details-timezone"
        />
      }
      onCancel={reset}
      onSave={handleSubmit(onSubmit)}
    />
  );
};

export default TimezoneRow;
