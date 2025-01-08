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

interface ISearchResultsProps {
  searchResults: ISearchResultGroup[];
  searchQuery?: string;
  isLoading?: boolean;
  onClose?: () => void;
  selectedIndex?: number;
}

const SearchResults: FC<ISearchResultsProps> = ({
  searchResults,
  searchQuery,
  isLoading,
  onClose = () => {},
  selectedIndex = -1,
}) => {
  const navigate = useNavigate();
  const itemRefs = useRef<Array<HTMLLIElement>>([]);

  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedIndex]);

  const handleItemClick = (
    entityType: ISearchResultType,
    entity: ISearchResult,
  ) => {
    switch (entityType) {
      case ISearchResultType.APP:
        window.open(
          `${window.location.origin}/apps/${entity.id}/launch`,
          '_target',
        );
        break;
      case ISearchResultType.KEYWORD:
        navigate(`/search?q=${entity.name}`);
        break;
      case ISearchResultType.CHANNEL:
        navigate(`/channels/${entity.id}`);
        break;
      case ISearchResultType.DOCUMENT:
        window.open(entity.url, '_target');
        break;
      case ISearchResultType.COURSE:
        navigate(getLearnUrl(`/courses/${entity.id}`));
        break;
      case ISearchResultType.EVENT:
        navigate(getLearnUrl(`/events/${entity.id}`));
        break;
      case ISearchResultType.PATH:
        navigate(getLearnUrl(`/paths/${entity.id}`));
        break;
      case ISearchResultType.PEOPLE:
        navigate(getLearnUrl(`/users/${entity.id}`));
        break;
      case ISearchResultType.TEAM:
        navigate(getLearnUrl(`/teams/${entity.id}`));
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
              size={18}
            />
            <div className="min-w-0">
              <Truncate
                text={result.fullName}
                className="text-xs"
                textRenderer={(text) => (
                  <HighlightText text={text} subString={searchQuery} />
                )}
              />
            </div>
            {result?.designation && (
              <div className="flex gap-2 items-center">
                <div className="flex w-[3px] h-[3px] bg-neutral-500 rounded-full" />
                <div className="text-xxs font-semibold text-neutral-500">
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
              <Icon name="hashtagOutline" size={16} hover={false} />
            </div>
            <div className="min-w-0">
              <Truncate
                text={result.name}
                className="text-xs"
                textRenderer={(text) => (
                  <HighlightText text={text} subString={searchQuery} />
                )}
              />
            </div>
            {!!result?.totalMembers && (
              <div className="flex gap-2 items-center">
                <div className="flex w-[3px] h-[3px] bg-neutral-500 rounded-full" />
                <div className="text-xxs text-neutral-500">
                  <span className="font-bold">{result.totalMembers}</span>{' '}
                  members
                </div>
              </div>
            )}
          </div>
        );
      case ISearchResultType.TEAM:
        return (
          <div className="flex gap-1.5 items-center overflow-hidden">
            <div className="flex items-center justify-center">
              <Icon name="team" size={18} hover={false} />
            </div>
            <div className="min-w-0">
              <Truncate
                text={result.name}
                className="text-xs"
                textRenderer={(text) => (
                  <HighlightText text={text} subString={searchQuery} />
                )}
              />
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex w-[3px] h-[3px] bg-neutral-500 rounded-full" />
              <div className="text-xxs text-neutral-500">
                <span className="font-bold">{result.membersCount}</span> members
              </div>
            </div>
          </div>
        );
      case ISearchResultType.APP:
        return (
          <div className="flex gap-1.5 items-center overflow-hidden">
            <img
              className="object-cover h-[18px] w-[18px] rounded-full "
              src={result.imageUrl || DefaultAppIcon}
              alt="App Icon"
            />
            <div className="min-w-0">
              <Truncate
                text={result.name}
                className="text-xs"
                textRenderer={(text) => (
                  <HighlightText text={text} subString={searchQuery} />
                )}
              />
            </div>
            {!!result?.category && (
              <div className="flex gap-2 items-center">
                <div className="flex w-[3px] h-[3px] bg-neutral-500 rounded-full" />
                <div className="text-xxs font-bold text-neutral-500 capitalize">
                  {result.category}
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
            <Icon name={iconName} size={18} hover={false} />
            <div className="min-w-0">
              <Truncate
                text={result.name}
                className="text-xs"
                textRenderer={(text) => (
                  <HighlightText text={text} subString={searchQuery} />
                )}
              />
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex w-[3px] h-[3px] bg-neutral-500 rounded-full" />
              <div className="text-xxs font-bold text-neutral-500 capitalize">
                {entityType}
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
                className="object-cover h-[18px] w-[18px] rounded border-1 border-white"
                src={result.imageUrl}
                alt="Banner"
              />
            ) : null}
            <div className="min-w-0">
              <Truncate
                text={result.name}
                className="text-xs"
                textRenderer={(text) => (
                  <HighlightText text={text} subString={searchQuery} />
                )}
              />
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex w-[3px] h-[3px] bg-neutral-500 rounded-full" />
              <div className="text-xxs font-bold text-neutral-500 capitalize">
                {entityType}
              </div>
            </div>
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

  return isLoading ? (
    <div className="flex flex-col px-3">
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
              <div className="text-[#666F8B] text-xs px-3 font-bold leading-4">
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
                return (
                  <li
                    id={`search-item-${index}`}
                    key={`search-item-${index}`}
                    className={`flex py-[4px] gap-2 px-3 items-center hover:bg-primary-50 cursor-pointer ${
                      index === selectedIndex && 'bg-primary-50'
                    }`}
                    onClick={() => handleItemClick(entity.module, result)}
                    onKeyUp={(e) =>
                      e.code === 'Enter'
                        ? handleItemClick(entity.module, result)
                        : ''
                    }
                    tabIndex={index === selectedIndex ? 0 : -1}
                    ref={(el: HTMLLIElement) => (itemRefs.current[index] = el)}
                    aria-selected={selectedIndex === index}
                  >
                    {entity.module === ISearchResultType.KEYWORD && (
                      <Icon
                        name="clock"
                        size={14}
                        hover={false}
                        color="text-[#FF3366]"
                      />
                    )}
                    {getEntityRenderer(result, entity.module)}
                  </li>
                );
              })}
            </ul>
          </li>
        ) : null,
      )}
    </ul>
  );
};

export default SearchResults;
