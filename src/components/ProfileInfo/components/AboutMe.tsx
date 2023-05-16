import clsx from 'clsx';
import Button, {
  Variant as ButtonVariant,
  Size as ButtonSize,
} from 'components/Button';
import Card from 'components/Card';
import Divider from 'components/Divider';
import Icon from 'components/Icon';
import IconWrapper, { Type } from 'components/Icon/components/IconWrapper';
import TextArea from 'components/TextArea';
import useHover from 'hooks/useHover';
import React, { useMemo, useState } from 'react';

export interface IAboutMeProps {
  aboutMe: any;
  canEdit?: boolean;
}

const AboutMe: React.FC<IAboutMeProps> = ({ aboutMe, canEdit }) => {
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isHovered, eventHandlers] = useHover();
  const onHoverStyles = useMemo(
    () => clsx({ 'mb-8': true }, { 'shadow-xl': isHovered }),
    [isHovered],
  );

  return (
    <>
      {canEdit ? (
        <div {...eventHandlers}>
          <Card className={onHoverStyles}>
            <div className="flex justify-between items-center px-6">
              <div className="text-neutral-900 font-bold text-base pt-6 pb-4">
                About me
              </div>
              {isHovered && !isEditable ? (
                <IconWrapper type={Type.Square} className="cursor-pointer">
                  <Icon
                    name="edit"
                    size={16}
                    onClick={() => setIsEditable(!isEditable)}
                  />
                </IconWrapper>
              ) : (
                isHovered &&
                isEditable && (
                  <div className="flex space-x-3">
                    <Button
                      variant={ButtonVariant.Secondary}
                      label={'Cancel'}
                      size={ButtonSize.Small}
                      onClick={() => setIsEditable(false)}
                    />
                    <Button label={'Save'} size={ButtonSize.Small} />
                  </div>
                )
              )}
            </div>
            <Divider />
            <div className="text-neutral-900 text-sm font-normal pt-4 pb-6 px-6">
              {!isEditable ? (
                aboutMe?.fullName
              ) : (
                <TextArea placeholder="write here" rows={3} />
              )}
            </div>
          </Card>
        </div>
      ) : (
        <Card className={onHoverStyles}>
          <div className="flex justify-between items-center">
            <div className="text-neutral-900 font-bold text-base pt-6 pb-4">
              About me
            </div>
          </div>
          <Divider />
          <div className="text-neutral-900 text-sm font-normal pt-4 pb-6">
            {aboutMe?.fullName}
          </div>
        </Card>
      )}
    </>
  );
};

export default AboutMe;
