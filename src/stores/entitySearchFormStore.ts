import { create } from 'zustand';
import _ from 'lodash';
import { UseFormReturn } from 'react-hook-form';
import { IAudienceForm } from 'components/EntitySearchModal';

export interface IEntitySearchFormStore {
  form: UseFormReturn<IAudienceForm, any> | null;
  setForm: (form: UseFormReturn<IAudienceForm, any> | null) => void;
}

export const useEntitySearchFormStore = create<IEntitySearchFormStore>(
  (set) => ({
    form: null,
    setForm: (form: UseFormReturn<IAudienceForm, any> | null) =>
      set(() => ({
        form: form,
      })),
  }),
);
