import Icon from 'components/Icon';
import { usePermissions } from 'hooks/usePermissions';
import { Doc } from 'interfaces';
// import moment from 'moment';
import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';
import { getIconFromMime } from './Doc';
import { humanizeTime } from 'utils/time';

interface IRecentlyAddedEntitiesProps {}

const RecentlyAddedEntities: FC<IRecentlyAddedEntitiesProps> = ({}) => {
  const { getApi } = usePermissions();
  const useChannelFiles = getApi(ApiEnum.GetChannelFiles);
  const { channelId } = useParams();

  const { data } = useChannelFiles({
    channelId: channelId,
    params: {
      // modifiedAfter: moment().startOf('D').subtract(1, 'M').valueOf(),
      limit: 5,
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <p className="text-base font-bold text-neutral-900">Recently added</p>
      <div className="flex gap-6">
        {(data as Doc[])?.slice(0, 5)?.map((each) => (
          <div
            key={each.id}
            className="flex w-[233px] p-2 gap-1 border border-neutral-200 rounded-9xl"
          >
            <div className="flex w-8 h-8 items-center justify-center border rounded-full shadow-md border-neutral-200">
              <Icon
                name={each.isFolder ? 'dir' : getIconFromMime(each.mimeType)}
                size={16}
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xs font-medium leading-[18px] text-neutral-900">
                {each?.name}
              </div>
              <div className="text-[8px] font-medium text-neutral-500 leading-3">
                added{' '}
                {each.externalCreatedAt
                  ? humanizeTime(each.externalCreatedAt)
                  : 'while ago'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyAddedEntities;
