import React from 'react';
import Button, {
  Variant as ButtonVariant,
  Size as ButtonSize,
} from 'components/Button';
import Icon from 'components/Icon';
import IconWrapper, { Type } from 'components/Icon/components/IconWrapper';
import {
  FieldValues,
  UseFormHandleSubmit,
  UseFormReset,
} from 'react-hook-form';
import './styles.css';
import { IUpdateAboutMe } from './AboutMe';

export type HeaderProps = {
  title: string;
  dataTestId?: string;
  isHovered?: boolean;
  isEditable?: boolean;
  setIsEditable?: (hide: boolean) => void;
  canEdit?: boolean;
  onSubmit?: any;
  handleSubmit?: UseFormHandleSubmit<FieldValues>;
  setInitialSkills?: () => void;
  isLoading?: boolean;
  reset?: UseFormReset<IUpdateAboutMe>;
};

const Header: React.FC<HeaderProps> = ({
  title,
  dataTestId,
  isHovered = false,
  isEditable = false,
  setIsEditable = () => null,
  canEdit = false,
  onSubmit,
  handleSubmit = () => null,
  setInitialSkills,
  isLoading,
  reset,
}) => {
  return (
    <div className="flex justify-between items-center mb-3">
      <div
        className="text-neutral-900 font-bold text-lg"
        data-testid={dataTestId}
      >
        {title}
      </div>
      {canEdit && isHovered && !isEditable ? (
        <IconWrapper
          type={Type.Square}
          className="cursor-pointer"
          dataTestId={`edit-${dataTestId}`}
        >
          <Icon
            name="edit"
            size={16}
            onClick={() => setIsEditable(!isEditable)}
          />
        </IconWrapper>
      ) : (
        isEditable && (
          <div className="flex space-x-3 slide-in-right">
            <Button
              variant={ButtonVariant.Secondary}
              label={'Cancel'}
              size={ButtonSize.Small}
              onClick={() => {
                setInitialSkills && setInitialSkills();
                setIsEditable(false);
                reset && reset();
              }}
              dataTestId={`${dataTestId}-cancel`}
            />
            <Button
              label={'Save'}
              size={ButtonSize.Small}
              // onClick={handleSubmit(onSubmit)}
              dataTestId={`${dataTestId}-save`}
              loading={isLoading}
            />
          </div>
        )
      )}
    </div>
  );
};

export default Header;
