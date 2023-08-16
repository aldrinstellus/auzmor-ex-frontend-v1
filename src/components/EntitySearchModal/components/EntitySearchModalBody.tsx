import React, { ReactNode } from 'react';
import { EntitySearchModalType, IMemberForm } from '..';
import MembersBody from './MembersBody';
import {
  Control,
  UseFormResetField,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

interface IEntitySearchModalBodyProps {
  entityType: EntitySearchModalType;
  control: Control<IMemberForm, any>;
  watch: UseFormWatch<IMemberForm>;
  setValue: UseFormSetValue<IMemberForm>;
  resetField: UseFormResetField<IMemberForm>;
  entityRenderer: (data: any) => ReactNode;
}

const EntitySearchBodyModal: React.FC<IEntitySearchModalBodyProps> = ({
  entityType,
  control,
  watch,
  setValue,
  resetField,
  entityRenderer,
}) => {
  switch (entityType) {
    case EntitySearchModalType.Member:
      return (
        <MembersBody
          control={control}
          watch={watch}
          setValue={setValue}
          resetField={resetField}
          entityRenderer={entityRenderer}
        />
      );
    default:
      return <></>;
  }
};

export default EntitySearchBodyModal;
