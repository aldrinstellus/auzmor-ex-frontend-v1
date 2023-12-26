import Icon from 'components/Icon';
import PopupMenu from 'components/PopupMenu';
import useModal from 'hooks/useModal';
import useRole from 'hooks/useRole';
import DeleteTeam from 'pages/Users/components/DeleteModals/Team';
import React from 'react';

type AppProps = {
  id: string;
  onEdit?: () => any;
  triggerIcon?: string;
  className?: string;
  dataTestId?: string;
  dataTestIdPrefix?: string;
  isDetailPage?: boolean;
  iconColor?: string;
  iconClassName?: string;
};
const TeamOptions: React.FC<AppProps> = ({
  id,
  onEdit,
  triggerIcon = 'moreOutline',
  className,
  dataTestId,
  dataTestIdPrefix,
  isDetailPage = false,
  iconColor,
  iconClassName,
}) => {
  const [showDeleteModal, openDeleteModal, closeDeleteModal] = useModal(false);
  const { isAdmin } = useRole();

  const teamAllOption = [
    {
      icon: 'edit',
      label: 'Edit',
      onClick: onEdit,
      dataTestId: `${dataTestIdPrefix}edit-team`,
      enabled: isAdmin,
    },
    // {
    //   icon: 'shareForwardOutline',
    //   label: 'Share',
    //   dataTestId: `${dataTestIdPrefix}share-team`,
    //   enabled: isAdmin || isMember,
    // },
    {
      icon: 'cancel',
      label: 'Remove',
      labelClassName: 'text-red-500',
      iconClassName: '!text-red-500',
      onClick: openDeleteModal,
      dataTestId: `${dataTestIdPrefix}delete-team`,
      enabled: isAdmin,
    },
  ];

  const teamOption = teamAllOption.filter((option) => option?.enabled);

  return (
    <>
      <PopupMenu
        triggerNode={
          <div className="cursor-pointer">
            <Icon
              name={triggerIcon}
              color={iconColor}
              className={iconClassName}
              dataTestId={dataTestId}
            />
          </div>
        }
        menuItems={teamOption}
        className={className}
      />
      <DeleteTeam
        open={showDeleteModal}
        closeModal={closeDeleteModal}
        isDetailPage={isDetailPage}
        teamId={id}
      />
    </>
  );
};

export default TeamOptions;
