import React, { useRef } from 'react';
import InfoRow from '../InfoRow';
import moment from 'moment';
import * as yup from 'yup';
import 'moment-timezone';
import useRole from 'hooks/useRole';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCurrentUser } from 'queries/users';
import Icon from 'components/Icon';
import { twConfig } from 'utils/misc';
import { toastConfig } from '../utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Layout, { FieldType } from 'components/Form';

type AppProps = {
  data: any;
};

const DateOfJoiningRow: React.FC<AppProps> = ({ data }) => {
  const queryClient = useQueryClient();
  const ref = useRef<any>(null);
  const { isAdmin } = useRole();

  const schema = yup.object({
    joinDate: yup.date(),
  });

  const updateUserJoinDateMutation = useMutation({
    mutationFn: updateCurrentUser,
    mutationKey: ['update-user-joinDate-mutation'],
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
    const { joinDate } = getValues();
    updateUserJoinDateMutation.mutate({ joinDate: joinDate.toISOString() });
  };

  const fields = [
    {
      type: FieldType.DatePicker,
      name: 'joinDate',
      control,
      dataTestId: 'date-of-joining',
    },
  ];

  return (
    <InfoRow
      ref={ref}
      icon={{
        name: 'calendar',
        color: 'text-orange-500',
        bgColor: 'bg-orange-50',
      }}
      label="Date of Joining"
      canEdit={isAdmin}
      dataTestId="professional-details-joining-date"
      value={data?.joinDate && moment(data?.joinDate).format('Do MMMM YYYY')}
      editNode={
        <div>
          <form>
            <Layout fields={fields} />
          </form>
        </div>
      }
      onCancel={reset}
      onSave={handleSubmit(onSubmit)}
    />
  );
};

export default DateOfJoiningRow;
