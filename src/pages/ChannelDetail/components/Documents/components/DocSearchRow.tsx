import Icon from 'components/Icon';
import React from 'react';
import { getIconName } from './Doc';
import { humanizeTime } from 'utils/time';
import { humanFileSize } from 'utils/misc';

export enum Variant {
  Large = 'LARGE',
  Small = 'SMALL',
}

type DocSearchProps = {
  data?: any;
  variant?: Variant;
};

const DocSearchRow = ({ data, variant = Variant.Small }: DocSearchProps) => {
  const iconName = getIconName(data?.raw?.mimeType);

  if (variant === Variant.Small) {
    return (
      <div
        className="   flex items-center hover:bg-primary-50 w-full cursor-pointer gap-4"
        onClick={() => {
          window.open(data?.raw?.fileUrl, '_blank');
        }}
      >
        <div className="flex gap-2">
          <Icon name={iconName || 'doc'} size={20} />
          <div className="text-sm bold text-neutral-950 ">
            {data?.raw?.name}
          </div>
        </div>
      </div>
    );
  } else if (variant === Variant.Large) {
    return (
      <div
        className="flex items-center hover:bg-primary-50 w-full cursor-pointer gap-4"
        onClick={() => {
          window.open(data?.raw?.fileUrl, '_blank');
        }}
      >
        <div className="flex gap-2">
          <Icon name={iconName || 'doc'} size={56} />
          <div className="flex flex-col">
            <div className="text-xxs font-medium text-neutral-500">
              {iconName === 'folder' ? 'FOLDER' : 'DOCUMENT'}
            </div>
            <div className="text-base font-semibold text-neutral-900 ">
              {data?.raw?.name}
            </div>
            <div className="flex items-center justify-start gap-4 text-xs text-neutral-500 font-normal">
              {data?.raw?.size ? (
                <div>{humanFileSize(data?.raw?.size || 0)}</div>
              ) : null}
              {data?.raw?.size ? (
                <div className="bg-neutral-500 w-2 h-2 rounded-full" />
              ) : null}
              {data?.raw.modifiedAt ? (
                <div>{`Updated ${humanizeTime(data?.raw?.modifiedAt)}`}</div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <></>;
};

export default DocSearchRow;
