import clsx from 'clsx';
import Icon from 'components/Icon';
import IconWrapper, { Type } from 'components/Icon/components/IconWrapper';
import useHover from 'hooks/useHover';
import React, { useState } from 'react';

interface IIcon {
  name: string;
  color: string;
  bgColor: string;
}

type AppProps = {
  icon: IIcon;
  label: string | React.ReactNode;
  value: string | React.ReactNode;
  canEdit?: boolean;
  editNode?: React.ReactNode;
  dataTestId?: string;
  bgColor?: string;
  border?: boolean;
  fallBackValue?: string;
  onCancel?: () => any;
  onSave?: (...args: any) => any;
};

const InfoRow: React.FC<AppProps> = ({
  icon,
  label,
  value,
  canEdit = true,
  editNode,
  dataTestId,
  border = true,
  fallBackValue = 'Field not specified',
  onCancel = () => null,
  onSave = () => null,
}) => {
  const [isHovered, eventHandlers] = useHover();
  const [editMode, setEditMode] = useState(false);

  return (
    <div
      {...eventHandlers}
      data-testid={dataTestId}
      className={clsx({ 'relative py-6': true }, { 'border-b': border })}
    >
      <div className="flex items-center">
        <div className="flex items-center w-[200px]">
          <IconWrapper
            type={Type.Square}
            className={icon.bgColor}
            border={false}
          >
            <Icon name={icon.name} color={icon.color} size={16} />
          </IconWrapper>
          <div className="text-neutral-500 font-bold text-sm ml-2.5">
            {label}
          </div>
        </div>
        {editMode ? (
          <div className="flex items-center space-x-2">
            <div>{editNode}</div>
            <div className="flex items-center">
              <IconWrapper
                type={Type.Circle}
                className="mr-2 w-8 h-8 rounded-full"
                onClick={() => {
                  setEditMode(false);
                  onCancel?.();
                }}
              >
                <Icon name="close" size={12} color="text-neutral-900" />
              </IconWrapper>
              <IconWrapper
                type={Type.Circle}
                className="w-8 h-8 rounded-full bg-primary-500"
                onClick={onSave}
              >
                <Icon name="check" size={16} color="text-white" />
              </IconWrapper>
            </div>
          </div>
        ) : (
          <div className="text-neutral-900 font-medium">
            {value || fallBackValue}
          </div>
        )}
      </div>
      {!editMode && canEdit && isHovered && (
        <div className="absolute right-0 top-7">
          <Icon name="edit" size={16} onClick={() => setEditMode(true)} />
        </div>
      )}
    </div>
  );
};

export default InfoRow;
