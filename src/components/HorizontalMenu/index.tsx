import useCarousel from 'hooks/useCarousel';
import React, { ReactElement } from 'react';

type MenuItem = {
  label: string;
  id: any;
  onClick?: any;
};

type HorizontalMenuProps = {
  items: MenuItem[];
  onChange: (id: any) => void;
};

const HorizontalMenu: React.FC<HorizontalMenuProps> = ({
  items,
  onChange = (id: any) => {},
}): ReactElement => {
  const [currentIndex, prev, next, setCurrentIndex] = useCarousel(
    0,
    items.length,
  );
  return (
    <div className="flex gap-x-5 px-6 pt-4">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="cursor-pointer flex flex-col items-center justify-between w-14"
          onClick={() => {
            onChange(item.id);
            setCurrentIndex(index);
          }}
        >
          <p
            className={`font-bold text-sm pb-2 ${
              currentIndex === index ? 'text-neutral-900' : 'text-neutral-500'
            }`}
          >
            {item.label}
          </p>
          {currentIndex === index && (
            <div className="bg-primary-500 w-full h-1 rounded-full" />
          )}
        </div>
      ))}
    </div>
  );
};

export default HorizontalMenu;
