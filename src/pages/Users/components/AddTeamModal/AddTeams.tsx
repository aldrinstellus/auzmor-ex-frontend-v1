import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import { Variant as InputVariant } from 'components/Input';
import { ITeamForm } from '.';

export interface IAddTeamsProps {
  control: Control<ITeamForm, any>;
  errors: FieldErrors<ITeamForm>;
}

const AddTeams: React.FC<IAddTeamsProps> = ({ control, errors }) => {
  const teamName = [
    {
      type: FieldType.Input,
      InputVariant: InputVariant.Text,
      className: '',
      placeholder: 'ex. Product and design team',
      name: `name`,
      label: 'Team Name*',
      control,
      error: errors?.name?.message,
      dataTestId: '',
    },
  ];
  const teamCategory = [
    {
      type: FieldType.SingleSelect,
      name: 'category',
      placeholder: 'Select Category',
      label: 'Team Category*',
      dataTestId: '',
      options: [
        {
          value: 'DEPARTMENT',
          label: 'Department',
          dataTestId: '',
        },
        {
          value: 'LOCATION',
          label: 'Location',
          dataTestId: '',
        },
      ],
      error: errors.category?.message,
      control,
    },
  ];
  const teamDescription = [
    {
      type: FieldType.Input,
      InputVariant: InputVariant.Text,
      placeholder: 'What is the purpose of this team',
      name: `description`,
      label: 'Team Description',
      control,
      inputClassName: 'pb-16',
      dataTestId: '',
    },
  ];
  return (
    <form>
      <div className="p-6 space-y-6">
        <div className="flex space-x-2">
          <Layout fields={teamName} className="w-1/2" />
          <Layout fields={teamCategory} className="w-1/2" />
        </div>
        <Layout fields={teamDescription} />
      </div>
    </form>
  );
};

export default AddTeams;
