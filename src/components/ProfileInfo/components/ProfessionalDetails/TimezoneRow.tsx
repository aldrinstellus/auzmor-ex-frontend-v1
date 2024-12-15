import { FC, useRef } from 'react';
import * as yup from 'yup';
import InfoRow from '../InfoRow';
import SelectTimeZone from 'components/UserOnboard/components/SelectTimeZone';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getTimezoneNameFromIANA } from 'utils/time';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getDefaultTimezoneOption } from 'components/UserOnboard/utils';

import { useParams } from 'react-router-dom';
import useRole from 'hooks/useRole';
import useAuth from 'hooks/useAuth';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

type AppProps = {
  data: any;
};

const TimezoneRow: FC<AppProps> = ({ data }) => {
  const { userId = '' } = useParams();
  const { getApi } = usePermissions();
  const queryClient = useQueryClient();
  const defaultTimezone = getDefaultTimezoneOption();
  const ref = useRef<any>(null);
  const { user } = useAuth();
  const { isOwnerOrAdmin } = useRole({ userId: userId || user?.id });

  const schema = yup.object({
    timeZone: yup.object(),
  });

  const updateCurrentUser = getApi(ApiEnum.UpdateMe);
  const updateUserById = getApi(ApiEnum.UpdateUser);
  const updateUserTimezoneMutation = useMutation({
    mutationFn: userId
      ? (data: any) => updateUserById(userId, data)
      : (data: Record<string, any>) => updateCurrentUser(data),
    mutationKey: ['update-user-timeZone-mutation'],
    onError: (_error: any) => {},
    onSuccess: async (_response: any) => {
      successToastConfig({});
      ref?.current?.setEditMode(false);
      if (userId) {
        await queryClient.invalidateQueries(['user', userId]);
      } else {
        await queryClient.invalidateQueries(['current-user-me']);
      }
    },
  });

  const { handleSubmit, control, reset, getValues } = useForm<any>({
    mode: 'onSubmit',
    resolver: yupResolver(schema),
  });

  const onSubmit = () => {
    const selectedTimezone = getValues();
    const timezoneValue =
      selectedTimezone.timeZone?.value ||
      data?.timeZone ||
      defaultTimezone.value;
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
      canEdit={isOwnerOrAdmin}
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
