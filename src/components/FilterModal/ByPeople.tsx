import Layout, { FieldType } from 'components/Form';
import { FC } from 'react';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { IBypeople, IFilterForm } from '.';
import { enumToTitleCase } from 'utils/misc';

import { useDebounce } from 'hooks/useDebounce';
import { ICheckboxListOption } from 'components/CheckboxList';
import Icon from 'components/Icon';

export enum ByPeopleEnum {
  OTHERS = 'OTHERS',
  DIRECT_REPORTEES = 'DIRECT_REPORTEES',
}

interface IByPeopleProps {
  control: Control<IFilterForm, any>;
  watch: UseFormWatch<IFilterForm>;
  setValue: UseFormSetValue<IFilterForm>;
}

const ByPeople: FC<IByPeopleProps> = ({ control, watch, setValue }) => {
  const searchField = [
    {
      type: FieldType.Input,
      control,
      name: 'byPeopleSearch',
      placeholder: 'Search',
      isClearable: true,
      leftIcon: 'search',
      dataTestId: `people-search`,
    },
  ];

  const [peopleSearch, peopleCheckbox] = watch([
    'byPeopleSearch',
    'byPeopleCheckbox',
  ]);

  const debouncedPeopleSearchValue = useDebounce(peopleSearch || '', 300);
  const byPeopleData: IBypeople[] = [
    { id: ByPeopleEnum.OTHERS, name: enumToTitleCase(ByPeopleEnum.OTHERS) },
    {
      id: ByPeopleEnum.DIRECT_REPORTEES,
      name: enumToTitleCase(ByPeopleEnum.DIRECT_REPORTEES),
    },
  ].filter((value) =>
    value.name.toLowerCase().includes(debouncedPeopleSearchValue.toLowerCase()),
  );

  const byPeopleFields = [
    {
      type: FieldType.CheckboxList,
      name: 'byPeopleCheckbox',
      control,
      options: byPeopleData?.map((people: IBypeople) => ({
        data: people,
        datatestId: `by-people-${people.name.toLowerCase()}`,
      })),
      labelRenderer: (option: ICheckboxListOption) => (
        <div className="ml-2.5 cursor-pointer text-xs">{option.data.name}</div>
      ),
      rowClassName: 'px-6 py-3 border-b border-neutral-200',
    },
  ];

  return (
    <div className="px-2 py-4">
      <Layout fields={searchField} />
      <div className="max-h-[330px] min-h-[330px] overflow-y-auto">
        {!!peopleCheckbox?.length && (
          <div className="flex mt-2 mb-3 flex-wrap">
            {peopleCheckbox.map((people: ICheckboxListOption) => (
              <div
                key={people.data.id}
                data-testid="filter-options"
                className="flex items-center px-3 py-2 bg-neutral-100 rounded-17xl border border-neutral-200 mr-2 my-1"
              >
                <div className="text-primary-500 text-sm font-medium whitespace-nowrap">
                  {people.data.name}
                </div>
                <div className="ml-1">
                  <Icon
                    name="closeCircle"
                    size={16}
                    color="text-neutral-900"
                    onClick={() =>
                      setValue(
                        'byPeopleCheckbox',
                        peopleCheckbox.filter(
                          (selectedPeople: ICheckboxListOption) =>
                            selectedPeople.data.id !== people.data.id,
                        ),
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        {(() => {
          if ((byPeopleData || []).length > 0) {
            return (
              <div>
                <Layout fields={byPeopleFields} />
              </div>
            );
          }
          return (
            <>
              {(debouncedPeopleSearchValue === undefined ||
                debouncedPeopleSearchValue === '') &&
              byPeopleData?.length === 0 ? (
                <div className="flex items-center w-full text-lg font-bold">
                  Not found
                </div>
              ) : (
                <div className="py-16 w-full text-lg font-bold text-center">
                  {`No result found`}
                  {debouncedPeopleSearchValue &&
                    ` for '${debouncedPeopleSearchValue}'`}
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
};

export default ByPeople;
