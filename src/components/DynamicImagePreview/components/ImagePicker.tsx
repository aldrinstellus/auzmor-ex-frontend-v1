import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { toBlob } from 'html-to-image';
import Kudos1 from 'images/kudos1.png';
import Kudos2 from 'images/kudos2.png';
import Kudos3 from 'images/kudos3.png';
import Kudos4 from 'images/kudos4.png';
import Kudos5 from 'images/kudos5.png';
import Kudos6 from 'images/kudos6.png';
import Kudos7 from 'images/kudos7.png';
import Kudos8 from 'images/kudos8.png';
import Icon from 'components/Icon';
import { twConfig } from 'utils/misc';

const templateImages = [
  {
    id: 1,
    image: Kudos1,
    label: 'Thanks for the Exceptional Effort',
    bgColor: 'bg-[#FFEDD5]',
  },
  {
    id: 2,
    image: Kudos2,
    label: 'Your motivation is inspiring',
    bgColor: 'bg-[#D1FAE5]',
  },
  {
    id: 3,
    image: Kudos3,
    label: 'Good Job!',
    bgColor: 'bg-[#FCE8F3]',
  },
  {
    id: 4,
    image: Kudos4,
    label: 'I Appreciate your excellent work!',
    bgColor: 'bg-[#E5EDFF]',
  },
  {
    id: 5,
    image: Kudos5,
    label: 'Thank you for your hardwork!',
    bgColor: 'bg-[#FDFDEA]',
  },
  {
    id: 6,
    image: Kudos6,
    label: 'I truly appreciate the effort',
    bgColor: 'bg-[#E1EFFE]',
  },
  {
    id: 7,
    image: Kudos7,
    label: 'Thank you for your contributions.',
    bgColor: 'bg-[#FDFDEA]',
  },
  {
    id: 8,
    image: Kudos8,
    label: 'Impressive Work!',
    bgColor: 'bg-[#EDEBFE]',
  },
];

export interface IImagePickerProps {
  onSelect: (file: any) => void;
  selectedTemplate?: any;
}

const ImagePicker: React.FC<IImagePickerProps> = ({
  selectedTemplate,
  onSelect,
}) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const handleSelectTemplate = (item: any) => {
    if (selectedTemplate?.id === item.id) {
      onSelect(null);
    } else {
      onSelect(item);
    }
  };

  return (
    <div className="ml-2 mb-2">
      <div className="flex gap-4 flex-wrap">
        {templateImages.map((item) => (
          <div
            key={item.id}
            className={clsx(
              'relative cursor-pointer max-w-[270px] max-h-[183px] min-h-[183px] max-w-[270px] border-1 border-neutral-200 w-full h-full rounded-[12px] overflow-hidden',
              { 'border-primary-500': item.id === selectedTemplate?.id },
            )}
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
            <img src={item.image} />
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
