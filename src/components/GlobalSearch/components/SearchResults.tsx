import Avatar from 'components/Avatar';
import Icon from 'components/Icon';
import NoDataFound from 'components/NoDataFound';
import {
  ISearchResultGroup,
  ISearchResult,
  ISearchResultType,
} from 'interfaces/search';
import { sumBy } from 'lodash';
import React, { FC, useEffect, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
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

interface ISearchResultsProps {
  searchResults: ISearchResultGroup[];
  searchQuery?: string;
  isLoading?: boolean;
  onClose?: () => void;
  selectedIndex?: number;
  updateSearchQuery: (query: string) => void;
}

const getFormattedDate = (datestr: string, timezone: string | undefined) => {
  return `${moment(datestr)
    .tz(timezone || 'UTC')
    .format('MMM DD, YYYY')}`;
};

const SearchResults: FC<ISearchResultsProps> = ({
  searchResults,
  searchQuery,
  isLoading,
  onClose = () => {},
  selectedIndex = -1,
  updateSearchQuery,
}) => {
  const navigate = useNavigate();
  const { getApi } = usePermissions();
  const itemRefs = useRef<Array<HTMLLIElement>>([]);
  const { user } = useAuth();

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
  });

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
        sourceType:
          entityType?.charAt(0).toUpperCase() +
          entityType?.slice(1)?.toLowerCase(),
      });
    }
    switch (entityType) {
      case ISearchResultType.APP:
        window.open(
          `${window.location.origin}/apps/${entity.id}/launch`,
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
        window.location.assign(getLearnUrl(`/courses/${entity.id}`));
        break;
      case ISearchResultType.EVENT:
        window.location.assign(getLearnUrl(`/events/${entity.id}`));
        break;
      case ISearchResultType.PATH:
        window.location.assign(getLearnUrl(`/paths/${entity.id}`));
        break;
      case ISearchResultType.PEOPLE:
        window.location.assign(getLearnUrl(`/users/${entity.id}`));
        break;
      case ISearchResultType.TEAM:
        window.location.assign(getLearnUrl(`/teams/${entity.id}`));
        break;
      default:
        return;
    }
    onClose();
  };

  const getEntityRenderer = (
    result: ISearchResult,
    entityType: ISearchResultType,
  ) => {
    switch (entityType) {
      case ISearchResultType.PEOPLE:
        return (
          <div className="flex gap-1.5 items-center overflow-hidden">
            <Avatar
              name={result.fullName}
              image={result.imageUrl}
              bgColor={result.profileColor}
              size={24}
            />
            <div className="min-w-0">
              <Truncate
                text={result.fullName}
                className="text-sm leading-4"
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
          <div className="flex gap-1.5 items-center overflow-hidden">
            <div className="flex items-center justify-center">
              <Icon name="hashtagOutline" size={22} hover={false} />
            </div>
            <div className="min-w-0">
              <Truncate
                text={result.name}
                className="text-sm leading-4"
                textRenderer={(text) => (
                  <HighlightText text={text} subString={searchQuery} />
                )}
              />
            </div>
            {!!result?.totalMembers && (
              <div className="flex gap-2 items-center">
                <div className="flex w-[3px] h-[3px] bg-neutral-500 rounded-full" />
                <div className="text-xs text-neutral-500">
                  {`${result.totalMembers} members`}
                </div>
              </div>
            )}
          </div>
        );
      case ISearchResultType.TEAM:
        return (
          <div className="flex gap-1.5 items-center overflow-hidden">
            <div className="flex items-center justify-center">
              <Icon name="team" size={24} hover={false} />
            </div>
            <div className="min-w-0">
              <Truncate
                text={result.name}
                className="text-sm leading-4"
                textRenderer={(text) => (
                  <HighlightText text={text} subString={searchQuery} />
                )}
              />
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex w-[3px] h-[3px] bg-neutral-500 rounded-full" />
              <div className="text-xs text-neutral-500">
                {`${result.totalMembers} members`}
              </div>
            </div>
          </div>
        );
      case ISearchResultType.APP:
        return (
          <div className="flex gap-1.5 items-center overflow-hidden">
            <img
              className="object-cover h-[24px] w-[24px] rounded-full "
              src={result.imageUrl || DefaultAppIcon}
              alt="App Icon"
            />
            <div className="min-w-0">
              <Truncate
                text={result.name}
                className="text-sm"
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
          <div className="flex gap-1.5 items-center overflow-hidden">
            <Icon name={iconName} size={24} hover={false} />
            <div className="min-w-0">
              <Truncate
                text={result.name}
                className="text-sm"
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
      case ISearchResultType.EVENT:
        return (
          <div className="flex gap-1.5 items-center overflow-hidden">
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
                className="text-sm leading-4"
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
          <div className="flex pr-2 items-center gap-2 w-full overflow-hidden">
            <div className="flex items-center gap-2 grow">
              <Icon name="clock" size={14} color="!text-[#FF3366]" />
              <Truncate
                text={result.term}
                className="text-sm text-black leading-4"
              />
            </div>
            <Icon
              name="close"
              className="hidden group-hover:block p-[2px]"
              size={16}
              color="!text-black"
              onClick={(e) => {
                e.stopPropagation();
                deleteRecentSearchTermMutation.mutate(result.id);
              }}
            />
          </div>
        );
      default:
        return (
          <div className="text-xs overflow-hidden">
            <Truncate
              text={result.name}
              className="text-xs"
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
        className="py-4 w-full"
        illustration="noDocumentFound"
        hideClearBtn
        dataTestId="globalsearch-noDataFound"
      />
    );
  }

  return (
    <div className="max-h-[356px] overflow-y-auto">
      {isLoading ? (
        <div className="flex flex-col">
          <Skeleton count={10} />
        </div>
      ) : (
        <ul className="flex flex-col gap-3.5">
          {searchResults.map((entity, entityIndex) =>
            entity.results.length > 0 ? (
              <li
                key={entity.module}
                className="flex flex-col gap-1.5 justify-center"
              >
                {entity.name ? (
                  <div className="text-[#666F8B] text-xs font-bold leading-4">
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
                      entity.module === ISearchResultType.RECENT &&
                      result?.sourceType
                        ? (result.sourceType.toLowerCase() as ISearchResultType)
                        : entity.module;
                    return (
                      <li
                        id={`search-item-${index}`}
                        key={`search-item-${index}`}
                        className={`flex py-[4px] gap-2 items-center group hover:bg-primary-50 cursor-pointer ${
                          index === selectedIndex && 'bg-primary-50'
                        }`}
                        onClick={() => handleItemClick(entityType, result)}
                        onKeyUp={(e) =>
                          e.code === 'Enter'
                            ? handleItemClick(entityType, result)
                            : ''
                        }
                        tabIndex={index === selectedIndex ? 0 : -1}
                        ref={(el: HTMLLIElement) =>
                          (itemRefs.current[index] = el)
                        }
                        aria-selected={selectedIndex === index}
                      >
                        {getEntityRenderer(result, entityType)}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ) : null,
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
