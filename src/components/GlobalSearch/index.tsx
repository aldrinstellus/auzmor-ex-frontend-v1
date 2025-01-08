import { FC, useEffect, useRef, useState } from 'react';
import SearchInput from './components/SearchInput';
import { useTranslation } from 'react-i18next';
import IconButton from 'components/IconButton';

export interface IGlobalSearchProps {}

const GlobalSearch: FC<IGlobalSearchProps> = () => {
  const { t } = useTranslation('components', { keyPrefix: 'GlobalSearch' });
  const [isExpanded, setIsExpanded] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target as Node)
    ) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div data-testid="global-search" ref={searchRef} className="relative">
      <IconButton
        icon="search2"
        size={20}
        dataTestId="global-search-icon"
        ariaLabel={t('search')}
        onClick={() => setIsExpanded(!isExpanded)}
        color="text-[#888888]"
        className="bg-white hover:!bg-neutral-100 rounded-md active:bg-white py-[10px] px-[13px]"
        iconClassName="group-hover:!text-neutral-500"
      />
      {isExpanded && <SearchInput onClose={() => setIsExpanded(false)} />}
    </div>
  );
};

export default GlobalSearch;
