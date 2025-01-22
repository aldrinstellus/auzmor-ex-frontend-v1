import { FC } from 'react';
import SearchModal from './components/SearchModal';
import useModal from 'hooks/useModal';
import { useTranslation } from 'react-i18next';
import IconButton from 'components/IconButton';

export interface IGlobalSearchProps {}

const GlobalSearch: FC<IGlobalSearchProps> = () => {
  const { t } = useTranslation('components', { keyPrefix: 'GlobalSearch' });
  const [isModalOpen, openModal, closeModal] = useModal();

  return (
    <div data-testid="global-search">
      <IconButton
        icon="search2"
        size={24}
        dataTestId="global-search-icon"
        ariaLabel={t('search')}
        onClick={openModal}
        color="text-[#888888]"
        className="bg-white hover:!bg-neutral-100 rounded-md active:bg-white py-[10px] px-[13px]"
        iconClassName="group-hover:!text-neutral-500"
      />
      {isModalOpen && <SearchModal onClose={closeModal} />}
    </div>
  );
};

export default GlobalSearch;
