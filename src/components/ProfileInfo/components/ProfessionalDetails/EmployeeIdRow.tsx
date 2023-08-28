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
import useAuth from 'hooks/useAuth';
import { useParams } from 'react-router-dom';

type AppProps = {
  data: any;
};

const EmployeeIdRow: React.FC<AppProps> = ({ data }) => {
  const queryClient = useQueryClient();
  const ref = useRef<any>(null);
  const { isAdmin } = useRole();

  const schema = yup.object({
    employeeId: yup.string(),
  });

  const updateUserEmployeeIdMutation = useMutation({
    mutationFn: updateCurrentUser,
    mutationKey: ['update-user-employeeId-mutation'],
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
      value={data?.employeeId}
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
