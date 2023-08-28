import React, { useRef } from 'react';
import InfoRow from '../InfoRow';
import 'moment-timezone';
import useRole from 'hooks/useRole';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCurrentUser } from 'queries/users';
import Icon from 'components/Icon';
import { convertUpperCaseToPascalCase, twConfig } from 'utils/misc';
import { toastConfig } from '../utils';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';

type AppProps = {
  data: any;
};

const MarriedRow: React.FC<AppProps> = ({ data }) => {
  const queryClient = useQueryClient();
  const ref = useRef<any>(null);
  const { isAdmin } = useRole();

  const updateUserMarriedMutation = useMutation({
    mutationFn: updateCurrentUser,
    mutationKey: ['update-user-married-mutation'],
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
      menuPlacement: 'top',
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
