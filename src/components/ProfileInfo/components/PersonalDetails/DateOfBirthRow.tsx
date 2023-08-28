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

const DateOfBirthRow: React.FC<AppProps> = ({ data }) => {
  const queryClient = useQueryClient();
  const ref = useRef<any>(null);
  const { isAdmin } = useRole();

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
    defaultValues: {
      personal: {
        birthDate:
          data?.personal?.birthDate && new Date(data?.personal?.birthDate),
      },
      skills: '',
    },
  });

  const onSubmit = () => {
    const { personal } = getValues();
    updateUserJoinDateMutation.mutate({
      personal: {
        birthDate: personal.birthDate,
      },
    });
  };

  const fields = [
    {
      type: FieldType.DatePicker,
      name: 'personal.birthDate',
      className: '',
      minDate: moment().subtract(100, 'years').toDate(),
      maxDate: new Date(),
      control,
      dataTestId: 'personal-details-dob',
      defaultValue: getValues()?.personal?.birthDate,
    },
  ];

  return (
    <InfoRow
      ref={ref}
      icon={{
        name: 'cake',
        color: 'text-purple-500',
        bgColor: 'bg-purple-50',
      }}
      label="Date of Birth"
      canEdit={isAdmin}
      dataTestId="user-dob"
      value={
        data?.personal?.birthDate &&
        moment(data?.personal?.birthDate).format('DD MMMM YYYY')
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

export default DateOfBirthRow;
