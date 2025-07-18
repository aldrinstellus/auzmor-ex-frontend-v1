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
  return (
    <div
      className="flex gap-2 items-center hover:bg-primary-50 cursor-pointer"
      onPointerDown={(e) => e.preventDefault()}
      onClick={() => onClick(data)}
    >
      <Icon name={iconName} />
      <div className="flex flex-col gap-1">
        <div className="text-xs">
          <HighlightText text={data?.name || ''} subString={searchQuery} />
        </div>
        <div className="text-xs text-neutral-700">
          {t('updatedOn', {
            date: moment(data?.updatedAt).format('DD MMM YYYY'),
          })}{' '}
          &nbsp;
          {data?.externalModifiedBy &&
            t('updatedBy', { name: data?.externalModifiedBy })}
        </div>
        {data?.customFields && !Array.isArray(data?.customFields) && (
          <div className="text-xs text-neutral-700">
            &quot;
            <HighlightText
              text={
                Array.isArray(data.customFields.custom_field_values)
                  ? data.customFields.custom_field_values[0]
                  : data.customFields.custom_field_values
              }
              subString={searchQuery}
            />
            &quot;
            &nbsp;
            {t('foundIn')}
            &nbsp;
            <span className="font-semibold">
              {data?.customFields?.field_name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocSearchRow;
