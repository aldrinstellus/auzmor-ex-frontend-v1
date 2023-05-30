import React from 'react';
import Button, {
  Variant as ButtonVariant,
  Size as ButtonSize,
} from 'components/Button';
import Icon from 'components/Icon';
import IconWrapper, { Type } from 'components/Icon/components/IconWrapper';
import { FieldValues, UseFormHandleSubmit } from 'react-hook-form';

export type HeaderProps = {
  title: string;
  dataTestId?: string;
  isHovered: boolean;
  isEditable: boolean;
  setIsEditable: (hide: boolean) => void;
  canEdit?: boolean;
  onSubmit?: any;
  handleSubmit: UseFormHandleSubmit<FieldValues>;
  setInitialSkills?: () => void;
  isLoading?: boolean;
};

const Header: React.FC<HeaderProps> = ({
  title,
  dataTestId,
  isHovered,
  isEditable,
  setIsEditable,
  canEdit,
  onSubmit,
  handleSubmit,
  setInitialSkills,
  isLoading,
}) => {
  return (
    <div className="flex justify-between items-center px-6">
      <div
        className="text-neutral-900 font-bold text-base pt-6 pb-4"
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
          <div className="flex space-x-3">
            <Button
              variant={ButtonVariant.Secondary}
              label={'Cancel'}
              size={ButtonSize.Small}
              onClick={() => {
                setInitialSkills && setInitialSkills();
                setIsEditable(false);
              }}
              dataTestId={`${dataTestId}-cancel`}
            />
            <Button
              label={'Save'}
              size={ButtonSize.Small}
              onClick={handleSubmit(onSubmit)}
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
