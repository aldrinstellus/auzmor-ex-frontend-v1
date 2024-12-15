import IconButton from 'components/IconButton';
import Spinner from 'components/Spinner';
import { usePermissions } from 'hooks/usePermissions';
import useRole from 'hooks/useRole';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getLearnUrl } from 'utils/misc';
import { ApiEnum } from 'utils/permissions/enums/apiEnum';

const Cart = () => {
  const { t } = useTranslation('navbar');

  const { getApi } = usePermissions();
  const useGetCartItems = getApi(ApiEnum.GetCartItems);
  const { data, isLoading } = useGetCartItems();
  const cartItemCount = data?.result?.total_records;
  const { isLearner } = useRole();
  return (
    <div className="relative" title={t('learn.cartTitle')}>
      {!isLoading && cartItemCount > 0 && (
        <div
          className="absolute text-[8px] tracking-[0.3px] 
             h-[15px] min-w-[15px] 
            font-semibold font-lato text-light opacity-100
             no-underline rounded-full bg-primary-500 border border-white text-white 
               leading-[10px] p-[3px] top-1 right-2.5 flex  items-center justify-center"
        >
          {cartItemCount > 10 ? t('learn.cartCount') : cartItemCount || ''}
        </div>
      )}
      {isLoading && (
        <Spinner className="absolute top-1 right-2.5 fill-primary-500 !w-4 !h-4 !m-0" />
      )}
      <IconButton
        icon="shoppingCart"
        color="text-[#888888]"
        size={23}
        onClick={() => {
          window.open(getLearnUrl(isLearner ? '/user/checkout' : '/checkout'));
        }}
        ariaLabel={t('learn.cartTitle')}
        className="bg-white hover:!bg-neutral-100 rounded-md active:bg-white py-[9px] px-[13px]"
        iconClassName="group-hover:!text-neutral-500"
      />
    </div>
  );
};

export default Cart;
