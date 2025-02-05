import Avatar from 'components/Avatar';
import Icon from 'components/Icon';
import NoDataFound from 'components/NoDataFound';
import {
  ISearchResultGroup,
  ISearchResult,
  ISearchResultType,
} from 'interfaces/search';
import { sumBy } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import useNavigate from 'hooks/useNavigation';
import { getLearnUrl } from 'utils/misc';
import DefaultAppIcon from 'images/DefaultAppIcon.svg';
import { getIconFromMime } from 'pages/ChannelDetail/components/Documents/components/Doc';
import HighlightText from 'components/HighlightText';
import Truncate from 'components/Truncate';
import { usePermissions } from 'hooks/usePermissions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import moment from 'moment';
import useAuth from 'hooks/useAuth';
import { useTranslation, Trans } from 'react-i18next';
import IconButton, {
  Variant as IconButtonVariant,
} from 'components/IconButton';
import useRole from 'hooks/useRole';
import Spinner from 'components/Spinner';

interface ISearchResultsProps {
  searchResults: ISearchResultGroup[];
  searchQuery?: string;
  isLoading?: boolean;
  onClose?: () => void;
  selectedIndex?: number;
  updateSearchQuery: (query: string) => void;
}

interface IDeletedResult {
  module: ISearchResultType;
  id: string;
  resultClickedId: string;
}

const getFormattedDate = (datestr: string, timezone: string | undefined) => {
  return `${moment(datestr)
    .tz(timezone || 'UTC')
    .format('MMM DD, YYYY')}`;
};

function getSourceType(entityType: ISearchResultType): string {
  switch (entityType) {
    case ISearchResultType.APP:
      return 'App';
    case ISearchResultType.CHANNEL:
      return 'Channel';
    case ISearchResultType.DOCUMENT:
      return 'Document';
    case ISearchResultType.COURSE:
      return 'Course';
    case ISearchResultType.EVENT:
      return 'Event';
    case ISearchResultType.PATH:
    case ISearchResultType.LEARNING_PATH:
      return 'LearningPath';
    case ISearchResultType.PEOPLE:
      return 'User';
    case ISearchResultType.TEAM:
      return 'Team';
    default:
      return (
        entityType?.charAt(0).toUpperCase() +
        entityType?.slice(1)?.toLowerCase()
      );
  }
}

const SearchResults: FC<ISearchResultsProps> = ({
  searchResults,
  searchQuery,
  isLoading,
  onClose = () => {},
  selectedIndex = -1,
  updateSearchQuery,
}) => {
  const { t } = useTranslation('components', { keyPrefix: 'GlobalSearch' });
  const navigate = useNavigate();
  const { getApi } = usePermissions();
  const itemRefs = useRef<Array<HTMLLIElement>>([]);

  const [deletedResult, setDeletedResult] = useState<IDeletedResult | null>(
    null,
  );
  const { user } = useAuth();
  const { isAdmin } = useRole();

  const queryClient = useQueryClient();

  const clickSearchResultApi = getApi(ApiEnum.ClickSearchResult);
  const clickSearchResultMutation = useMutation({
    mutationFn: (payload: { sourceId: string; sourceType: string }) =>
      clickSearchResultApi(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['global-recent-clicked-results']);
    },
  });

  const deleteRecentSearchTermApi = getApi(ApiEnum.DeleteRecentSearchTerm);
  const deleteRecentSearchTermMutation = useMutation({
    mutationFn: deleteRecentSearchTermApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries(['global-recent-search-terms']);
    },
    onSettled: () => {
      setDeletedResult(null);
    },
  });

  const deleteRecentClickedResultApi = getApi(
    ApiEnum.DeleteRecentClickedResult,
  );
  const deleteRecentClickedResultMutation = useMutation({
    mutationFn: deleteRecentClickedResultApi,
    onSuccess: async () => {
      await queryClient.invalidateQueries(['global-recent-clicked-results']);
    },
    onSettled: () => {
      setDeletedResult(null);
    },
  });

  const isDeleting =
    deleteRecentSearchTermMutation.isLoading ||
    deleteRecentClickedResultMutation.isLoading;

  function isResultDeleted(result: ISearchResult) {
    if (deletedResult?.module === ISearchResultType.KEYWORD) {
      return deletedResult?.id === result.id;
    } else {
      return deletedResult?.resultClickedId === result.resultClickedId;
    }
  }

  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedIndex]);

  const handleItemClick = async (
    entityType: ISearchResultType,
    entity: ISearchResult,
  ) => {
    if (entityType === ISearchResultType.KEYWORD) {
      updateSearchQuery(entity.term);
      return;
    } else {
      await clickSearchResultMutation.mutateAsync({
        sourceId: entity.id,
        sourceType: getSourceType(entityType),
      });
    }
    switch (entityType) {
      case ISearchResultType.APP:
        window.open(
          `${window.location.origin}${isAdmin ? '/apps/' : '/user/apps/'}${
            entity.id
          }/launch`,
          '_target',
        );
        break;
      case ISearchResultType.CHANNEL:
        navigate(`/channels/${entity.id}`);
        break;
      case ISearchResultType.DOCUMENT:
        window.open(entity.url, '_target');
        break;
      case ISearchResultType.COURSE:
        window.location.assign(
          getLearnUrl(
            isAdmin
              ? `/courses/${entity.id}`
              : `/user/courses/${entity.id}/detail`,
          ),
        );
        break;
      case ISearchResultType.EVENT:
        window.location.assign(
          getLearnUrl(
            isAdmin
              ? `/events/${entity.id}`
              : `/user/events/${entity.id}/detail`,
          ),
        );
        break;
      case ISearchResultType.PATH:
      case ISearchResultType.LEARNING_PATH:
        window.location.assign(
          getLearnUrl(
            isAdmin ? `/paths/${entity.id}` : `/user/paths/${entity.id}/detail`,
          ),
        );
        break;
      case ISearchResultType.USER:
      case ISearchResultType.PEOPLE:
        window.location.assign(getLearnUrl(`/users/${entity.id}`));
        break;
      case ISearchResultType.TEAM:
        isAdmin
          ? window.location.assign(getLearnUrl(`/teams/${entity.id}`))
          : navigate(`/teams/${entity.id}`);
        break;
      default:
        return;
    }
    onClose();
  };

  const getEntityRenderer = (
    result: ISearchResult,
    entityType: ISearchResultType,
    isRecent: boolean,
  ) => {
    const textStyles = `text-sm leading-4 text-black ${
      isRecent ? 'font-semibold' : ''
    }`;
    switch (entityType) {
      case ISearchResultType.PEOPLE:
      case ISearchResultType.USER:
        return (
          <div className="flex gap-1.5 items-center w-full overflow-hidden">
            <Avatar
              name={result.fullName}
              image={result.imageUrl}
              bgColor={result.profileColor}
              size={24}
            />
            <div className="min-w-0">
              <Truncate
                text={result.fullName}
                className={textStyles}
                textRenderer={(text) => (
                  <HighlightText text={text} subString={searchQuery} />
                )}
              />
            </div>
            {result?.designation && (
              <div className="flex gap-2 items-center">
                <div className="flex w-[3px] h-[3px] bg-neutral-500 rounded-full" />
                <div className="text-xs text-neutral-500">
                  {result?.designation}
                </div>
              </div>
            )}
          </div>
        );
      case ISearchResultType.CHANNEL:
        return (
          <div className="flex gap-1.5 items-center w-full overflow-hidden">
            <div className="flex items-center justify-center border-1 border-neutral-200 rounded-full h-[24px] w-[24px] shrink-0">
              <Icon
                name="hashtagOutline"
                size={16}
                hover={false}
                color="!text-neutral-500"
              />
            </div>
            <div className="min-w-0">
              <Truncate
                text={result.name}
                className={textStyles}
                textRenderer={(text) => (
                  <HighlightText text={text} subString={searchQuery} />
                )}
              />
            </div>
            <div className="flex gap-2 items-center shrink-0">
              <div className="flex w-[3px] h-[3px] bg-neutral-500 rounded-full" />
              <div className="text-xs text-neutral-500">
                {`${result.usersCount || 0} members`}
              </div>
            </div>
          </div>
        );
      case ISearchResultType.TEAM:
        return (
          <div className="flex gap-1.5 items-center w-full overflow-hidden">
            <div className="flex items-center justify-center">
              <Icon
                name="team"
                size={24}
                hover={false}
                color="!text-neutral-500"
              />
            </div>
            <div className="min-w-0">
              <Truncate
                text={result.name}
                className={textStyles}
                textRenderer={(text) => (
                  <HighlightText text={text} subString={searchQuery} />
                )}
              />
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex w-[3px] h-[3px] bg-neutral-500 rounded-full" />
              <div className="text-xs text-neutral-500">
                {`${result.membersCount} members`}
              </div>
            </div>
          </div>
        );
      case ISearchResultType.APP:
        return (
          <div className="flex gap-1.5 items-center w-full overflow-hidden">
            <img
              className="object-cover h-[24px] w-[24px] rounded-full "
              src={result.imageUrl || DefaultAppIcon}
              alt="App Icon"
            />
            <div className="min-w-0">
              <Truncate
                text={result.name}
                className={textStyles}
                textRenderer={(text) => (
                  <HighlightText text={text} subString={searchQuery} />
                )}
              />
            </div>
            {result?.categories?.length > 0 && (
              <div className="flex gap-2 items-center">
                <div className="flex w-[3px] h-[3px] bg-neutral-500 rounded-full" />
                <div className="text-xs text-neutral-500 capitalize">
                  {result.categories[0].title}
                </div>
              </div>
            )}
          </div>
        );
      case ISearchResultType.DOCUMENT:
        const iconName = result?.isFolder
          ? 'folder'
          : getIconFromMime(result?.mimeType);
        return (
          <div className="flex gap-1.5 items-center w-full overflow-hidden">
            <Icon name={iconName} size={24} hover={false} />
            <div className="min-w-0">
              <Truncate
                text={result.name}
                className={textStyles}
                textRenderer={(text) => (
                  <HighlightText text={text} subString={searchQuery} />
                )}
              />
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex w-[3px] h-[3px] bg-neutral-500 rounded-full" />
              <div className="text-xs text-neutral-500">
                {`Created on ${getFormattedDate(
                  result.createdAt,
                  user?.timezone,
                )}`}
              </div>
            </div>
          </div>
        );
      case ISearchResultType.COURSE:
      case ISearchResultType.PATH:
      case ISearchResultType.LEARNING_PATH:
      case ISearchResultType.EVENT:
        return (
          <div className="flex gap-1.5 items-center w-full overflow-hidden">
            {result?.imageUrl ? (
              <img
                className="object-cover h-[24px] w-[24px] rounded border-1 border-white"
                src={result.imageUrl}
                alt="Banner"
              />
            ) : null}
            <div className="min-w-0">
              <Truncate
                text={result.name}
                className={textStyles}
                textRenderer={(text) => (
                  <HighlightText text={text} subString={searchQuery} />
                )}
              />
            </div>
            {result?.categories?.length > 0 ? (
              <div className="flex gap-2 items-center">
                <div className="flex w-[3px] h-[3px] bg-neutral-500 rounded-full" />
                <div className="text-xs text-neutral-500 capitalize">
                  {result.categories[0].title}{' '}
                  {result.categories.length > 1 && (
                    <span className="font-bold">{`+${
                      result.categories.length - 1
                    }`}</span>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        );
      case ISearchResultType.KEYWORD:
        return (
          <div className="flex items-center gap-2 w-full overflow-hidden">
            <div className="flex items-center justify-center shrink-0">
              <Icon
                name="clock"
                size={14}
                color="!text-primary-500"
                hover={false}
              />
            </div>
            <div className="min-w-0">
              <Truncate
                text={result.term}
                toolTipClassName="max-w-lg break-words"
                className={textStyles}
              />
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full overflow-hidden">
            <Truncate
              text={result.name}
              className={textStyles}
              textRenderer={(text) => (
                <HighlightText text={text} subString={searchQuery} />
              )}
            />
          </div>
        );
    }
  };

  if (
    !isLoading &&
    sumBy(searchResults, (entity) => entity.results.length) === 0
  ) {
    return (
      <NoDataFound
        className="p-4 pr-1 w-full flex flex-col items-center justify-center"
        searchString={searchQuery}
        onClearSearch={() => updateSearchQuery('')}
        labelHeader={
          <p className="flex justify-center text-base">
            <Trans
              t={t}
              i18nKey="noDataFoundHeader"
              components={{
                searchQuery: (
                  <Truncate
                    text={searchQuery || ''}
                    toolTipClassName="text-left !max-w-lg break-words"
                    maxLength={30}
                  />
                ),
              }}
            />
          </p>
        }
        message={
          <p className="text-neutral-900 text-xs leading-normal tracking-[0.3px]">
            {t('noDataFoundMessageLine1')}
            <br />
            {t('noDataFoundMessageLine2')}
          </p>
        }
        illustration="noSearchResultFound"
        dataTestId="globalsearch-noDataFound"
      />
    );
  }

  return (
    <div
      className="max-h-[325px] overflow-y-auto 
      [&::-webkit-scrollbar]:w-2.5
      [&::-webkit-scrollbar-thumb]:bg-neutral-400
      [&::-webkit-scrollbar-thumb:hover]:bg-neutral-500
      [&::-webkit-scrollbar-track]:bg-neutral-200"
    >
      {isLoading ? (
        <div className="flex flex-col pl-3 gap-2 my-1">
          {[...Array(10)].map((element) => (
            <div className="flex gap-1.5 items-center h-5" key={element}>
              <Skeleton width={20} height={20} />
              <div className="grow">
                <Skeleton height={20} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {searchResults.map((entity, entityIndex) => {
            const isRecent =
              entity.module === ISearchResultType.RECENT ||
              entity.module === ISearchResultType.KEYWORD;
            return entity.results.length > 0 ? (
              <li
                key={entity.module}
                className={`flex flex-col ${
                  isRecent ? 'gap-3' : 'gap-1.5 pb-0.5'
                } justify-center`}
              >
                {entity.name ? (
                  <div className="text-[#666F8B] text-xs font-bold leading-5 pl-3">
                    {entity.name}
                  </div>
                ) : null}
                <ul className="flex flex-col justify-center">
                  {entity.results.map((result: any, resultIndex: number) => {
                    const index =
                      sumBy(
                        searchResults.slice(0, entityIndex),
                        (entity) => entity.results.length,
                      ) + resultIndex;
                    const entityType =
                      isRecent && result?.sourceType
                        ? (result.sourceType.toLowerCase() as ISearchResultType)
                        : entity.module;
                    return (
                      <li
                        id={`search-item-${index}`}
                        key={`search-item-${index}`}
                        className={`flex px-3 py-[4px] gap-2 items-center group/result hover:bg-primary-50 cursor-pointer ${
                          index === selectedIndex && 'bg-primary-50'
                        }`}
                        onClick={() => handleItemClick(entityType, result)}
                        onKeyUp={(e) =>
                          e.code === 'Enter'
                            ? handleItemClick(entityType, result)
                            : ''
                        }
                        ref={(el: HTMLLIElement) =>
                          (itemRefs.current[index] = el)
                        }
                        aria-selected={selectedIndex === index}
                      >
                        {getEntityRenderer(result, entityType, isRecent)}
                        {isRecent && (
                          <div className="relative w-4 h-4 shrink-0">
                            {!isDeleting ? (
                              <IconButton
                                icon={'close2'}
                                className={`absolute -top-[1px] -right-[1px] ${
                                  selectedIndex === index
                                    ? 'visible'
                                    : 'invisible'
                                } group-hover/result:visible !rounded-none `}
                                color="!text-neutral-900"
                                iconClassName="group-hover:!text-red-500 group-focus:!text-red-500"
                                size={18}
                                variant={IconButtonVariant.Secondary}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeletedResult({
                                    module: entity.module,
                                    id: result.id,
                                    resultClickedId: result.resultClickedId,
                                  });
                                  if (
                                    entity.module === ISearchResultType.KEYWORD
                                  )
                                    deleteRecentSearchTermMutation.mutate(
                                      result.id,
                                    );
                                  else
                                    deleteRecentClickedResultMutation.mutate(
                                      result.resultClickedId,
                                    );
                                }}
                              />
                            ) : null}
                            {isDeleting && isResultDeleted(result) ? (
                              <Spinner className="absolute -top-1 -right-1 !text-black" />
                            ) : null}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ) : null;
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
