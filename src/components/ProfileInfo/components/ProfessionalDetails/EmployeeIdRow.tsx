import React, { useRef } from 'react';
import InfoRow from '../InfoRow';
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

const EmployeeIdRow: React.FC<AppProps> = ({ data }) => {
  const { userId = '' } = useParams();
  const queryClient = useQueryClient();
  const ref = useRef<any>(null);
  const { isAdmin } = useRole();

  const schema = yup.object({
    employeeId: yup.string(),
  });

  const updateUserEmployeeIdMutation = useMutation({
    mutationFn: userId
      ? (data: any) => updateUserById(userId, data)
      : updateCurrentUser,
    mutationKey: ['update-user-employeeId-mutation'],
    onError: (error: any) => {},
    onSuccess: async (response: any) => {
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
    resolver: yupResolver(schema),
    defaultValues: data?.employeeId,
  });

  const onSubmit = () => {
    const { employeeId } = getValues();
    updateUserEmployeeIdMutation.mutate({ employeeId });
  };

  const fields = [
    {
      type: FieldType.Input,
      name: 'employeeId',
      placeholder: 'Employee ID',
      control,
      dataTestId: 'employee-id',
    },
  ];

  return (
    <InfoRow
      ref={ref}
      icon={{
        name: 'employee-tag',
        color: 'text-teal-500',
        bgColor: 'bg-teal-50',
      }}
      label="Employee ID"
      value={data?.employeeId || data?.id}
      canEdit={isAdmin}
      dataTestId="professional-details-employee-id"
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

export default EmployeeIdRow;
