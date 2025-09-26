import isBoolean from 'lodash/isBoolean';
import isEmpty from 'lodash/isEmpty';
import { Doc } from 'interfaces';
import { getIconFromMime } from './Doc';
import Icon from 'components/Icon';
import moment from 'moment';
import HighlightText from 'components/HighlightText';
import { useTranslation } from 'react-i18next';

type DocSearchProps = {
  data: Doc;
  searchQuery?: string;
  onClick?: (doc: Doc) => void;
};

const DocSearchRow = ({
  data,
  searchQuery = '',
  onClick = () => {},
}: DocSearchProps) => {
  const { t } = useTranslation('channelDetail', {
    keyPrefix: 'documentTab',
  });
  const iconName = data?.isFolder ? 'folder' : getIconFromMime(data?.mimeType);
  const matchedValue = Array.isArray(data?.customFields)
    ? data.customFields.find((field: any) => field.is_matched === true)
    : {};
  return (
    <div
      className="flex gap-2 hover:bg-primary-50 cursor-pointer"
      onPointerDown={(e) => e.preventDefault()}
      onClick={() => onClick(data)}
    >
      <div className='w-[5%]'>
        <Icon name={iconName} />
      </div>
      <div className="flex flex-col gap-1 w-[93%]">
        <div className="text-xs flex-1 min-w-0 overflow-hidden">
          <div className='line-clamp-2 break-all'>
            <HighlightText text={data?.name || ''} subString={searchQuery} />
          </div>
        </div>
        <div className="text-xs text-neutral-700">
          {t('updatedOn', {
            date: moment(data?.updatedAt).format('DD MMM YYYY'),
          })}{' '}
          &nbsp;
          {data?.ownerName &&
            t('updatedBy', { name: data?.ownerName })}
        </div>
        {!isEmpty(matchedValue) && !isBoolean(matchedValue.field_values) && (
          <div className="text-xs text-neutral-700">
            &quot;
            <HighlightText
              text={Array.isArray(matchedValue.field_values)
                ? matchedValue.field_values.find((val: any) => val?.toLowerCase?.().includes(searchQuery?.toLowerCase?.()))
                : matchedValue.field_values?.Description ?? matchedValue.field_values}
              subString={searchQuery}
            />
            &quot;
            &nbsp;
            {t('foundIn')}
            &nbsp;
            <span className="font-semibold">
              {matchedValue.field_name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocSearchRow;
