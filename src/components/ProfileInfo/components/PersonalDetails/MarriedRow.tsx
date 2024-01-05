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

const MarriedRow: FC<AppProps> = ({ data }) => {
  const { userId = '' } = useParams();
  const queryClient = useQueryClient();
  const ref = useRef<any>(null);
  const { user } = useAuth();
  const { isOwnerOrAdmin } = useRole({ userId: userId || user?.id });

  const updateUserMarriedMutation = useMutation({
    mutationFn: userId
      ? (data: any) => updateUserById(userId, data)
      : updateCurrentUser,
    mutationKey: ['update-user-married-mutation'],
    onError: (_error: any) => {},
    onSuccess: async (_response: any) => {
      successToastConfig();
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
        maritalStatus: {
          label: convertUpperCaseToPascalCase(data?.personal?.maritalStatus),
          value: data?.personal?.maritalStatus,
        },
      },
    },
  });

  const onSubmit = () => {
    const { personal } = getValues();
    updateUserMarriedMutation.mutate({
      personal: { maritalStatus: personal?.maritalStatus?.value },
    });
  };

  const fields = [
    {
      type: FieldType.SingleSelect,
      name: 'personal.maritalStatus',
      placeholder: 'Select Marital Status',
      defaultValue: getValues()?.personal?.maritalStatus,
      dataTestId: 'personal-details-marital-status',
      options: [
        {
          value: 'MARRIED',
          label: 'Married',
          dataTestId: 'personal-details-marital-status-married',
        },
        {
          value: 'SINGLE',
          label: 'Single',
          dataTestId: 'personal-details-marital-status-single',
        },
      ],
      control,
      menuPlacement: 'topLeft',
      showSearch: false,
    },
  ];

  return (
    <InfoRow
      ref={ref}
      icon={{
        name: 'marriedIcon',
        color: 'text-red-500',
        bgColor: 'text-red-50',
      }}
      canEdit={isOwnerOrAdmin}
      label="Marital Status"
      value={
        data?.personal?.maritalStatus?.charAt(0) +
        data?.personal?.maritalStatus?.slice(1)?.toLowerCase()
      }
      dataTestId="user-marital-status"
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

export default MarriedRow;
