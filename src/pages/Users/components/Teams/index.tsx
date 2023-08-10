import React, { useEffect } from 'react';
import TeamsCard from './TeamsCard';
import Button, { Size, Variant } from 'components/Button';
import Layout, { FieldType } from 'components/Form';
import IconButton, {
  Variant as IconVariant,
  Size as IconSize,
} from 'components/IconButton';
import { Variant as InputVariant, Size as InputSize } from 'components/Input';
import useModal from 'hooks/useModal';
import { useInView } from 'react-intersection-observer';
import { useForm } from 'react-hook-form';
import { useDebounce } from 'hooks/useDebounce';
import TeamFilterModal from '../FilterModals/TeamFilterModal';
import AddTeamModal from '../AddTeamModal';
import { useInfiniteTeams } from 'queries/users';
import { isFiltersEmpty } from 'utils/misc';
import PageLoader from 'components/PageLoader';
import UsersSkeleton from '../Skeletons/UsersSkeleton';
import useAuth from 'hooks/useAuth';

interface IForm {
  search?: string;
}

export interface ITeamProps {
  setShowMyTeam: (show: boolean) => void;
  showAddTeamModal: boolean;
  openAddTeamModal: () => void;
  closeAddTeamModal: () => void;
}

const Team: React.FC<ITeamProps> = ({
  setShowMyTeam,
  showAddTeamModal,
  openAddTeamModal,
  closeAddTeamModal,
}) => {
  const [showFilterModal, openFilterModal, closeFilterModal] = useModal();
  const { ref, inView } = useInView();

  const { user } = useAuth();

  const {
    control,
    watch,
    getValues,
    formState: { errors },
  } = useForm<IForm>({
    mode: 'onChange',
  });

  const searchValue = watch('search');
  const debouncedSearchValue = useDebounce(searchValue || '', 500);

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteTeams(
      isFiltersEmpty({
        q: debouncedSearchValue,
      }),
    );

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  const teamsData = data?.pages.flatMap((page) => {
    return page?.data?.result?.data.map((team: any) => {
      try {
        return team;
      } catch (e) {
        console.log('Error', { team });
      }
    });
  });

  return (
    <div className="relative pb-8">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <Button
            label="My Teams"
            size={Size.Small}
            variant={Variant.Secondary}
            className="cursor-not-allowed h-9 grow-0"
            dataTestId=""
          />
          <Button
            label="All Teams"
            size={Size.Small}
            variant={Variant.Secondary}
            className="!py-2 grow-0"
            dataTestId=""
            active={!searchValue}
          />
        </div>
        <div className="flex space-x-2 justify-center items-center">
          <IconButton
            icon="filterLinear"
            onClick={openFilterModal}
            variant={IconVariant.Secondary}
            size={IconSize.Medium}
            borderAround
            className="bg-white"
            dataTestId=""
          />
          <IconButton
            icon="arrowSwap"
            variant={IconVariant.Secondary}
            size={IconSize.Medium}
            borderAround
            className="bg-white"
            dataTestId=""
          />
          <div>
            <Layout
              fields={[
                {
                  type: FieldType.Input,
                  variant: InputVariant.Text,
                  size: InputSize.Small,
                  leftIcon: 'search',
                  control,
                  getValues,
                  name: 'search',
                  placeholder: 'Search teams',
                  error: errors.search?.message,
                  dataTestId: '',
                  isClearable: true,
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="text-neutral-500 mt-6 mb-6">
        Showing {!isLoading && teamsData?.length} results
      </div>

      {/* Show selected category filter */}
      {/* <div></div> */}

      <div>
        <div className="flex flex-wrap gap-6">
          {(() => {
            if (isLoading) {
              const loaders = [...Array(30)].map((element) => (
                <div key={element}>
                  <UsersSkeleton />
                </div>
              ));
              return loaders;
            }
            if (teamsData && teamsData?.length > 0) {
              return (
                <>
                  {teamsData?.map((team: any) => (
                    <TeamsCard
                      key={team.id}
                      {...team}
                      setShowMyTeam={setShowMyTeam}
                    />
                  ))}
                  <div className="h-12 w-12">
                    {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
                  </div>
                  {isFetchingNextPage && <PageLoader />}
                </>
              );
            }
            return (
              <div className="py-16 w-full">
                <div className="flex w-full justify-center">
                  <img src={require('images/noResult.png')} />
                </div>

                <div className="text-center">
                  <div
                    className="mt-8 text-lg font-bold"
                    data-testid="no-result-found"
                  >
                    No result found for &apos;{searchValue}&apos;
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    Sorry we can&apos;t find the team you are looking for.
                    <br /> Please try using different filters.
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <Button label={'Clear search'} variant={Variant.Secondary} />
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      <AddTeamModal
        open={showAddTeamModal}
        openModal={openAddTeamModal}
        closeModal={closeAddTeamModal}
      />

      <TeamFilterModal
        open={showFilterModal}
        openModal={openFilterModal}
        closeModal={closeFilterModal}
      />
    </div>
  );
};

export default Team;
