import { FC, useRef } from 'react';
import InfoRow from '../InfoRow';
import 'moment-timezone';
import useRole from 'hooks/useRole';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCurrentUser, updateUserById } from 'queries/users';
import { convertUpperCaseToPascalCase } from 'utils/misc';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import { useParams } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import { successToastConfig } from 'components/Toast/variants/SuccessToast';

type AppProps = {
  data: any;
};

const GenderRow: FC<AppProps> = ({ data }) => {
  const { userId = '' } = useParams();
  const queryClient = useQueryClient();
  const ref = useRef<any>(null);
  const { user } = useAuth();
  const { isOwnerOrAdmin } = useRole({ userId: userId || user?.id });

  const updateUserGenderMutation = useMutation({
    mutationFn: userId
      ? (data: any) => updateUserById(userId, data)
      : updateCurrentUser,
    mutationKey: ['update-user-gender-mutation'],
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
    defaultValues: {
      personal: {
        gender: {
          label: convertUpperCaseToPascalCase(data?.personal?.gender),
          value: data?.personal?.gender,
        },
      },
    },
  });

  const onSubmit = () => {
    const { personal } = getValues();
    updateUserGenderMutation.mutate({
      personal: { gender: personal?.gender?.value },
    });
  };

  const fields = [
    {
      type: FieldType.SingleSelect,
      name: 'personal.gender',
      placeholder: 'Select Gender',
      defaultValue: getValues()?.personal?.gender,
      dataTestId: 'personal-details-gender',
      options: [
        {
          value: 'MALE',
          label: 'Male',
          dataTestId: 'personal-details-gender-male',
        },
        {
          value: 'FEMALE',
          label: 'Female',
          dataTestId: 'personal-details-gender-female',
        },
      ],
      control,
      showSearch: false,
    },
  ];

  return (
    <InfoRow
      ref={ref}
      icon={{
        name: data?.personal?.gender === 'FEMALE' ? 'femaleIcon' : 'male',
        color: 'text-pink-500',
        bgColor: 'bg-pink-50',
      }}
      label="Gender"
      canEdit={isOwnerOrAdmin}
      value={
        data?.personal?.gender?.charAt(0)?.toUpperCase() +
        data?.personal?.gender?.slice(1)?.toLowerCase()
      }
      dataTestId="personal-details-gender"
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

export default GenderRow;
