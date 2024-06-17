import { FC, useRef } from 'react';
import InfoRow from '../InfoRow';
import moment from 'moment';
import * as yup from 'yup';
import 'moment-timezone';
import useRole from 'hooks/useRole';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCurrentUser, updateUserById } from 'queries/users';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Layout, { FieldType } from 'components/Form';
import { useParams } from 'react-router-dom';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';

type AppProps = {
  data: any;
};

const DateOfJoiningRow: FC<AppProps> = ({ data }) => {
  const { userId = '' } = useParams();
  const queryClient = useQueryClient();
  const ref = useRef<any>(null);
  const { isAdmin } = useRole();

  const schema = yup.object({
    joinDate: yup.date(),
  });

  const updateUserJoinDateMutation = useMutation({
    mutationFn: userId
      ? (data: any) => updateUserById(userId, data)
      : updateCurrentUser,
    mutationKey: ['update-user-joinDate-mutation'],
    onError: (_error: any) => {},
    onSuccess: async (_response: any) => {
      successToastConfig({});
      ref?.current?.setEditMode(false);
      if (userId) {
        await queryClient.invalidateQueries(['user', userId]);
      } else {
        await queryClient.invalidateQueries(['current-user-me']);
      }
      await queryClient.invalidateQueries(['celebrations'], {
        exact: false,
      });
    },
  });

  const { handleSubmit, control, reset, getValues } = useForm<any>({
    mode: 'onSubmit',
    defaultValues: {
      joinDate: data?.joinDate && new Date(data?.joinDate),
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = () => {
    const { joinDate } = getValues();
    updateUserJoinDateMutation.mutate({
      joinDate: joinDate.format('YYYY-MM-DD'),
    });
  };

  const fields = [
    {
      type: FieldType.DatePicker,
      name: 'joinDate',
      control,
      dataTestId: 'date-of-joining',
      minDate: moment().subtract(100, 'years').toDate(),
      maxDate: new Date(),
      defaultValue: getValues()?.joinDate,
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
      value={
        data?.joinDate &&
        moment(data?.joinDate.slice(0, 10)).format('Do MMMM YYYY')
      }
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
