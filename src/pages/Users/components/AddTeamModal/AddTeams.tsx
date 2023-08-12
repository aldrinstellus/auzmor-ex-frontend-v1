import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import { Variant as InputVariant } from 'components/Input';
import { ITeamForm } from '.';
import { CategoryType } from 'queries/apps';

export interface IAddTeamsProps {
  control: Control<ITeamForm, any>;
  errors: FieldErrors<ITeamForm>;
  defaultValues: any;
}

const AddTeams: React.FC<IAddTeamsProps> = ({
  control,
  errors,
  defaultValues,
}) => {
  const teamName = [
    {
      type: FieldType.Input,
      InputVariant: InputVariant.Text,
      className: '',
      placeholder: 'ex. Product and design team',
      name: `name`,
      defaultValue: defaultValues,
      label: 'Team Name',
      required: true,
      control,
      error: errors?.name?.message,
      dataTestId: 'add-team-name',
      showCounter: true,
      maxLength: 100,
    },
  ];
  const teamCategory = [
    {
      type: FieldType.CreatableSearch,
      variant: InputVariant.Text,
      placeholder: 'Select a category',
      name: 'category',
      label: 'Team Category',
      required: true,
      control,
      defaultValue: defaultValues,
      categoryType: CategoryType.TEAM,
      error: errors.category?.message,
      dataTestId: 'select-team-category',
    },
  ];
  const teamDescription = [
    {
      type: FieldType.TextArea,
      name: 'description',
      label: 'Team description',
      placeholder: 'What is the purpose of this team',
      defaultValue: defaultValues,
      dataTestId: 'adding-team-description',
      control,
      className: 'resize-none rounded-19xl',
      rows: 4,
      maxLength: 200,
      showCounter: true,
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
