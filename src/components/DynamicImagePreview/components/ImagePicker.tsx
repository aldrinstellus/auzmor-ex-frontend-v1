import { FC, useRef } from 'react';
import clsx from 'clsx';
import Icon from 'components/Icon';
import { lxpTemplateImages, officeTemplateImages } from './ImageTemplate';
import useProduct from 'hooks/useProduct';

export interface IImagePickerProps {
  onSelect: (file: any) => void;
  selectedTemplate?: any;
}

const ImagePicker: FC<IImagePickerProps> = ({ selectedTemplate, onSelect }) => {
  const _imageRef = useRef<HTMLInputElement>(null);

  const handleSelectTemplate = (item: any) => {
    if (selectedTemplate?.id === item.id) {
      onSelect(null);
    } else {
      onSelect(item);
    }
  };
  const { isOffice } = useProduct();
  const templateImages = isOffice ? officeTemplateImages : lxpTemplateImages;

  return (
    <div className="flex justify-center mb-2">
      <div className="inline-grid grid-cols-2 gap-4">
        {templateImages.map((item) => (
          <div
            key={item.id}
            className={clsx(
              'relative cursor-pointer max-h-[182px] min-h-[183px] max-w-[270px] border-1 border-neutral-200 w-full h-full rounded-[12px] overflow-hidden',
              { 'border-primary-500': item.id === selectedTemplate?.id },
            )}
            tabIndex={0}
            onKeyUp={(e) =>
              e.code === 'Enter' ? handleSelectTemplate(item) : ''
            }
            onClick={() => handleSelectTemplate(item)}
          >
            {item.id === selectedTemplate?.id && (
              <Icon
                name="tickCircle"
                className="absolute top-2 right-2"
                color="text-primary-500"
                hover
              />
            )}
            <img src={item.image} alt={`${item.label} Image`} />
            <div className="py-3 px-2 text-sm font-semibold text-center">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImagePicker;
