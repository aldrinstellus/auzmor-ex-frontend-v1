import Icon from 'components/Icon';
import { FC, RefObject, useEffect, useRef, useState } from 'react';
import { getBlobUrl } from 'utils/misc';

interface IImagePreviewProps {
  selectedTemplate: any;
  imageFile: any;
  templateImageRef: RefObject<HTMLInputElement>;
  imageUploaderRef: RefObject<HTMLInputElement>;
  users: any[];
  onRemove: () => void;
}

const ImagePreview: FC<IImagePreviewProps> = ({
  selectedTemplate,
  imageFile,
  templateImageRef,
  imageUploaderRef,
  users,
  onRemove,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showNameCount, setShowNameCount] = useState(0);

  const formatUserList = (_showNameCount: any) => {
    const count = users.length;
    const showNames = users
      .slice(0, _showNameCount - 1)
      .map((user) => user.firstName || user.fullName)
      .join(', ');
    if (count === 1) {
      return users[0].firstName || users[0].fullName;
    }
    if (_showNameCount === count) {
      return `${showNames} and ${
        users[count - 1].firstName || users[count - 1].fullName
      }`;
    } else {
      return `${showNames} and ${count - _showNameCount + 1} others`;
    }
  };

  // Logic to handle number of username to show which fit in 1 line
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      let totalWidth = 0;
      let count = 0;

      for (let i = 0; i < users.length; i++) {
        const nameWidth =
          (users[i].firstName?.length || users[i].fullName.length) * 12; // Adjust this multiplier as needed
        totalWidth += nameWidth;

        if (totalWidth > containerWidth) {
          break;
        } else {
          count++;
        }
      }

      setShowNameCount(count);
    }
  }, [users]);

  return (
    <div className="relative">
      <div className="absolute top-[14px] right-[14px] flex items-center gap-1">
        {imageFile && (
          <div className="p-[7px] bg-white rounded cursor-pointer border border-neutral-200">
            <Icon
              name="edit"
              color="text-neutral-900"
              size={16}
              onClick={() => {
                imageUploaderRef?.current?.click();
              }}
            />
          </div>
        )}
        <div className="p-[7px] bg-white rounded cursor-pointer border border-neutral-200">
          <Icon
            name="close"
            color="text-neutral-900"
            size={16}
            onClick={onRemove}
            dataTestId="kudos-remove-banner"
          />
        </div>
      </div>
      {imageFile && (
        <img
          src={getBlobUrl(imageFile)}
          className="object-contain w-full h-full min-h-[209px]"
        />
      )}
      {selectedTemplate && (
        <div
          className={`${selectedTemplate.bgColor} w-full flex justify-center`}
        >
          <div
            ref={templateImageRef}
            className={`${selectedTemplate.bgColor} aspect-[3/1] min-h-[209px] max-w-[500px]`}
          >
            <div
              ref={containerRef}
              className={`${selectedTemplate.bgColor} flex flex-col justify-center items-center p-2 pb-0`}
              data-testid="kudos-banner-text"
            >
              <div className="mt-4">{selectedTemplate.label}</div>
              <div className="text-lg font-bold text-center">
                {formatUserList(showNameCount)}
              </div>
              <img
                src={selectedTemplate.image}
                className="object-contain w-full h-full max-h-[130px]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
