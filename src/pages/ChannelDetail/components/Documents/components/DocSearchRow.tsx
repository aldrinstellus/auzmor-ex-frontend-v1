import { Doc } from 'interfaces';
import { getIconFromMime } from './Doc';
import Icon from 'components/Icon';
import moment from 'moment';
import HighlightText from 'components/HighlightText';

type DocSearchProps = {
  data?: Doc;
  searchQuery?: string;
};

const DocSearchRow = ({ data, searchQuery = '' }: DocSearchProps) => {
  const iconName = data?.isFolder ? 'folder' : getIconFromMime(data?.mimeType);
  return (
    <div className="flex gap-2 items-center">
      <Icon name={iconName} />
      <div className="flex flex-col gap-1">
        <div className="text-xs">
          <HighlightText text={data?.name || ''} subString={searchQuery} />
        </div>
        <div className="text-xs">
          Updated on {moment(data?.updatedAt).format('DD MMM YYYY')} by Megan
          Berry
        </div>
      </div>
    </div>
  );
};

export default DocSearchRow;
