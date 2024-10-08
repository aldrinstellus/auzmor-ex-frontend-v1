import { FC, useRef } from 'react';
import InfoRow from '../InfoRow';
import moment from 'moment';
import 'moment-timezone';
import useRole from 'hooks/useRole';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import { useParams } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';
import { usePermissions } from 'hooks/usePermissions';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';

type AppProps = {
  data: any;
};

const DateOfBirthRow: FC<AppProps> = ({ data }) => {
  const { userId = '' } = useParams();
  const { getApi } = usePermissions();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const ref = useRef<any>(null);
  const { isOwnerOrAdmin } = useRole({ userId: userId || user?.id });

  const updateCurrentUser = getApi(ApiEnum.UpdateMe);
  const updateUserById = getApi(ApiEnum.UpdateUser);
  const updateUserJoinDateMutation = useMutation({
    mutationFn: userId
      ? (data: any) => updateUserById(userId, data)
      : (data: Record<string, any>) => updateCurrentUser(data),
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
        birthDate: personal.birthDate?.format('YYYY-MM-DD'),
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
      canEdit={isOwnerOrAdmin}
      dataTestId="user-dob"
      value={
        data?.personal?.birthDate &&
        moment(data?.personal?.birthDate.slice(0, 10)).format('DD MMMM YYYY')
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
