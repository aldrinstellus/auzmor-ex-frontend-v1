import Icon from 'components/Icon';
import React, { ReactElement } from 'react';

type EditIconProps = {
  setProfilePicture: (file: File[]) => void;
  dataTestId?: string;
};

const EditIcon: React.FC<EditIconProps> = ({
  setProfilePicture,
  dataTestId,
}): ReactElement => {
  return (
    <label htmlFor="file-input" data-testid={dataTestId}>
      <input
        id="file-input"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.length) {
            setProfilePicture(Array.prototype.slice.call(e.target.files));
          }
        }}
      />
      <Icon
        name="edit"
        className="absolute bg-primary-500 border-1 border-white rounded-full p-2 cursor-pointer top-0 right-0"
        color="text-white"
      />
    </label>
  );
};

export default EditIcon;
