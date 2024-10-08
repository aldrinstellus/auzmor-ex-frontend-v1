import Card from 'components/Card';
import Icon from 'components/Icon';
import useModal from 'hooks/useModal';
import { isFiltersEmpty } from 'utils/misc';
import useAuth from 'hooks/useAuth';
import TeamCard from './components/TeamCard';
import Button, { Size, Variant } from 'components/Button';
import useNavigate from 'hooks/useNavigation';
import SkeletonLoader from './components/SkeletonLoader';
import TeamNotFound from 'images/TeamNotFound.svg';
import { memo, FC, useMemo } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { usePermissions } from 'hooks/usePermissions';

export interface IMyTeamWidgetProps {
  className?: string;
}

const MyTeamWidget: FC<IMyTeamWidgetProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const { getApi } = usePermissions();
  const navigate = useNavigate();
  const [open, openCollpase, closeCollapse] = useModal(true, false);
  const { t } = useTranslation('team');
  const { t: tb } = useTranslation('button');

  const useInfiniteTeams = getApi(ApiEnum.GetTeams);
  const { data, isLoading, hasNextPage } = useInfiniteTeams({
    q: isFiltersEmpty({
      userId: user?.id,
      limit: 3,
    }),
  });

  const teamsData = data?.pages.flatMap((page: any) => {
    return page?.data?.result?.data.map((team: any) => team);
  });

  const toggleModal = () => {
    if (open) closeCollapse();
    else openCollpase();
  };

  const style = useMemo(
    () => clsx({ 'py-6 rounded-9xl': true, [className]: true }),
    [className],
  );

  return (
    <Card className={style} shadowOnHover>
      <div
        className="px-6 flex items-center justify-between cursor-pointer"
        onClick={toggleModal}
        onKeyUp={(e) => {
          if (e.code === 'Enter') toggleModal();
        }}
        tabIndex={0}
        title="teams widget"
        aria-expanded={open}
        role="button"
      >
        <div className="font-bold">{t('title')}</div>
        <Icon
          name={open ? 'arrowUp' : 'arrowDown'}
          size={20}
          color="text-neutral-900"
        />
      </div>
      <div
        className={`transition-max-h duration-300 ease-in-out overflow-hidden ${
          open ? 'max-h-[1000px]' : 'max-h-[0]'
        }`}
      >
        <div className="px-4 flex flex-col gap-4 mt-4">
          {(() => {
            if (isLoading) {
              return (
                <>
                  {[...Array(3)].map((_value, index) => (
                    <div
                      key={`${index}-my-team-widget-skeleton`}
                      className="py-2"
                    >
                      <SkeletonLoader />
                    </div>
                  ))}
                </>
              );
            }
            if (teamsData && teamsData?.length > 0) {
              return (
                <>
                  <ul className="divide-y divide-neutral-200">
                    {teamsData?.map((team: any) => (
                      <li key={team.id} className="py-2">
                        <TeamCard {...team} />
                      </li>
                    ))}
                  </ul>

                  {hasNextPage && (
                    <Button
                      variant={Variant.Secondary}
                      size={Size.Small}
                      className="py-[7px]"
                      label={tb('myTeams')}
                      dataTestId="my-teams-cta"
                      onClick={() => navigate('/teams?tab=myTeams')}
                    />
                  )}
                </>
              );
            }
            return (
              <div className="flex justify-center flex-col items-center gap-4">
                <img src={TeamNotFound} alt="Team Not Found" width={148} />
                <p className="text-sm font-semibold text-neutral-500 text-center px-2">
                  {t('notFound')}
                </p>
              </div>
            );
          })()}
        </div>
      </div>
    </Card>
  );
};

export default memo(MyTeamWidget);
