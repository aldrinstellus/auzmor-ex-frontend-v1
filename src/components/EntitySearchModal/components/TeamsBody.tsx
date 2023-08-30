import Divider from 'components/Divider';
import Layout, { FieldType } from 'components/Form';
import Spinner from 'components/Spinner';
import { useDebounce } from 'hooks/useDebounce';
import React, { ReactNode, useEffect, useState } from 'react';
import {
  Control,
  UseFormResetField,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { useInView } from 'react-intersection-observer';
import { IAudienceForm } from '..';
import { ITeam, useInfiniteTeams } from 'queries/teams';
import TeamRow from './TeamRow';
import InfiniteSearch from 'components/InfiniteSearch';
import { useInfiniteCategories } from 'queries/category';

interface ITeamsBodyProps {
  control: Control<IAudienceForm, any>;
  watch: UseFormWatch<IAudienceForm>;
  setValue: UseFormSetValue<IAudienceForm>;
  resetField: UseFormResetField<IAudienceForm>;
  entityRenderer?: (data: ITeam) => ReactNode;
  selectedTeamIds?: string[];
}

const TeamsBody: React.FC<ITeamsBodyProps> = ({
  control,
  watch,
  setValue,
  resetField,
  entityRenderer,
  selectedTeamIds = [],
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const formData = watch();
  const debouncedSearchValue = useDebounce(formData.teamSearch || '', 500);
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteTeams({
      q: debouncedSearchValue,
      category: selectedCategories,
    });
  const debouncedCategorySearchValue = useDebounce(
    formData.categorySearch || '',
    500,
  );
  const {
    data: categories,
    isLoading: categoryLoading,
    isFetchingNextPage: isFetchingNextCategoryPage,
    fetchNextPage: fetchNextCategoryPage,
    hasNextPage: hasNextCategoryPage,
  } = useInfiniteCategories({
    q: debouncedCategorySearchValue,
  });
  const teamsData = data?.pages
    .flatMap((page) => {
      return page?.data?.result?.data.map((team: ITeam) => {
        try {
          return team;
        } catch (e) {
          console.log('Error', { team });
        }
      });
    })
    .filter((team) => {
      if (formData.showSelectedMembers) {
        return !!formData.teams[team.id];
      }
      return true;
    });

  const categoryData = categories?.pages.flatMap((page) => {
    return (page as any)?.result?.data.map((category: any) => {
      try {
        return category;
      } catch (e) {
        console.log('Error', { category });
      }
    });
  });

  useEffect(() => {
    if (formData.selectAll) {
      selectAll();
    } else {
      deselectAll();
    }
  }, [formData.selectAll]);

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  useEffect(() => {
    if (selectedTeamIds.length) {
      selectedTeamIds.forEach((id: string) => {
        setValue(`teams.${id}`, true);
      });
    }
  }, []);

  const selectAll = () => {
    Object.keys(formData.teams).forEach((key) => {
      setValue(`teams.${key}`, true);
    });
  };

  const deselectAll = () => {
    Object.keys(formData.teams).forEach((key) => {
      setValue(`teams.${key}`, false);
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col py-4 px-6">
        <Layout
          fields={[
            {
              type: FieldType.Input,
              control,
              name: 'teamSearch',
              label: 'Search for a team',
              placeholder: 'Search via team name',
              isClearable: true,
            },
          ]}
          className="pb-4"
        />
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center text-neutral-500 font-medium ${
              !!!teamsData?.length && 'opacity-50 pointer-events-none'
            }`}
          >
            Quick filters:
            <div className="relative">
              <InfiniteSearch
                title="Category"
                control={control}
                options={
                  categoryData?.map((category) => ({
                    label: category.name,
                    value: category,
                    id: category.id,
                  })) || []
                }
                searchName={'categorySearch'}
                optionsName={'categories'}
                isLoading={categoryLoading}
                isFetchingNextPage={isFetchingNextCategoryPage}
                fetchNextPage={fetchNextCategoryPage}
                hasNextPage={hasNextCategoryPage}
                onApply={() =>
                  setSelectedCategories([
                    ...Object.keys(formData.categories).filter(
                      (key: string) => !!formData.categories[key],
                    ),
                  ])
                }
                onReset={() => {
                  setSelectedCategories([]);
                  if (formData?.categories) {
                    Object.keys(formData.categories).forEach((key: string) =>
                      setValue(`categories.${key}`, false),
                    );
                  }
                }}
                selectionCount={selectedCategories.length}
              />
            </div>
          </div>
          <div
            className={`cursor-pointer text-neutral-500 font-medium hover:underline ${
              !!!teamsData?.length && 'opacity-50 pointer-events-none'
            }`}
            onClick={() => {
              setSelectedCategories([]);
              Object.keys(formData.categories).forEach((key: string) =>
                setValue(`categories.${key}`, false),
              );
            }}
          >
            Clear filters
          </div>
        </div>
      </div>
      <Divider className="w-full" />
      <div className="pl-6 flex flex-col">
        <div
          className={`flex justify-between py-4 pr-6 ${
            !!!teamsData?.length && 'opacity-50 pointer-events-none'
          }`}
        >
          <div className="flex items-center">
            <Layout
              fields={[
                {
                  type: FieldType.Checkbox,
                  name: 'selectAll',
                  control,
                  label: 'Select all',
                  className: 'flex item-center',
                },
              ]}
            />
            <Layout
              fields={[
                {
                  type: FieldType.Checkbox,
                  name: 'showSelectedMembers',
                  control,
                  label: 'Show selected members',
                  className: 'flex item-center',
                },
              ]}
              className="ml-4"
            />
          </div>
          <div
            className="cursor-pointer text-neutral-500 font-semibold hover:underline"
            onClick={() => {
              setValue('selectAll', false);
              setValue('showSelectedMembers', false);
            }}
          >
            clear all
          </div>
        </div>
        <div className="flex flex-col max-h-72 overflow-scroll">
          {isLoading ? (
            <div className="flex items-center w-full justify-center p-12">
              <Spinner />
            </div>
          ) : teamsData?.length ? (
            teamsData?.map((team, index) => (
              <>
                <div className="py-2 flex items-center" key={team.id}>
                  <Layout
                    fields={[
                      {
                        type: FieldType.Checkbox,
                        name: `teams.${team.id}`,
                        control,
                        className: 'flex item-center mr-4',
                        transform: {
                          input: (value: ITeam | boolean) => !!value,
                          output: (e: React.ChangeEvent<HTMLInputElement>) => {
                            if (e.target.checked) return team;
                            return false;
                          },
                        },
                      },
                    ]}
                  />
                  {(entityRenderer && entityRenderer(team)) || (
                    <TeamRow team={team} />
                  )}
                </div>
                {index !== teamsData.length - 1 && <Divider />}
              </>
            ))
          ) : (
            <div className="flex flex-col items-center w-full justify-center">
              <div className="mt-8 mb-4">
                <img src={require('images/noResult.png')} />
              </div>
              <div className="text-neutral-900 text-lg font-bold mb-4">
                No result found
                {formData.teamSearch != '' && `for ‘${formData.teamSearch}’`}
              </div>
              <div className="text-neutral-500 text-xs">
                Sorry we can’t find the member you are looking for.
              </div>
              <div className="text-neutral-500 text-xs">
                Please check the spelling or try again.
              </div>
            </div>
          )}
          {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
        </div>
      </div>
    </div>
  );
};

export default TeamsBody;
