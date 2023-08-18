import Divider from 'components/Divider';
import Layout, { FieldType } from 'components/Form';
import Spinner from 'components/Spinner';
import { useDebounce } from 'hooks/useDebounce';
import {
  IDepartment,
  getDepartments,
  useGetDepartments,
} from 'queries/department';
import { ILocation, getLocations, useGetLocations } from 'queries/location';
import { IGetUser, useInfiniteUsers } from 'queries/users';
import React, { ReactNode, useEffect } from 'react';
import {
  Control,
  UseFormResetField,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { useInView } from 'react-intersection-observer';
import { IAudienceForm } from '..';
import { useInfiniteTeams } from 'queries/teams';
import TeamRow from './TeamRow';

interface ITeamsBodyProps {
  control: Control<IAudienceForm, any>;
  watch: UseFormWatch<IAudienceForm>;
  setValue: UseFormSetValue<IAudienceForm>;
  resetField: UseFormResetField<IAudienceForm>;
  entityRenderer?: (data: IGetUser) => ReactNode;
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
  const formData = watch();
  const debouncedSearchValue = useDebounce(formData.teamSearch || '', 500);
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteTeams({
      q: debouncedSearchValue,
      privacy: [formData.privacy?.value || ''],
      category: [formData.category?.value || ''],
    });
  const teamsData = data?.pages
    .flatMap((page) => {
      return page?.data?.result?.data.map((team: any) => {
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
  const { data: privacy, isLoading: privacyLoading } = useGetLocations('');
  const { data: category, isLoading: categoryLoading } = useGetDepartments('');

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

  // const getLocationOptions = (locations: ILocation[]) => {
  //   return locations.map((location: ILocation) => ({
  //     label: location.country,
  //     value: location.uuid,
  //   }));
  // };

  // const getPrivacyOptions = (privacy: any) => {
  //   return privacy.map((eachPrivacy: any) => ({
  //     label: eachPrivacy.name,
  //     value: eachPrivacy.id,
  //   }));
  // };
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
          <div className="flex items-center text-neutral-500 font-medium">
            Quick filters:
            <Layout
              fields={[
                {
                  type: FieldType.AsyncSingleSelect,
                  control,
                  name: 'privacy',
                  option: [],
                  // loadOptions: () => {},
                  placeholder: 'Privacy',
                  isLoading: privacyLoading,
                },
              ]}
              className="ml-2"
            />
            <Layout
              fields={[
                {
                  type: FieldType.AsyncSingleSelect,
                  control,
                  name: 'category',
                  placeholder: 'Category',
                  option: [],
                  // loadOptions: () => {},
                  isLoading: categoryLoading,
                },
              ]}
              className="ml-2"
            />
          </div>
          <div
            className="cursor-pointer text-neutral-500 font-medium hover:underline"
            onClick={() => {
              resetField('department');
              resetField('location');
            }}
          >
            Clear filters
          </div>
        </div>
      </div>
      <Divider className="w-full" />
      <div className="pl-6 flex flex-col">
        <div className="flex justify-between py-4 pr-6">
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
          ) : (
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
          )}
          {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
        </div>
      </div>
    </div>
  );
};

export default TeamsBody;
