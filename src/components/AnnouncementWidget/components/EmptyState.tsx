import NoAnnouncement from 'images/NoAnnouncement.svg';
import useRole from 'hooks/useRole';
import Button, { Size, Variant } from 'components/Button';
import { FC } from 'react';

interface EmptyStateProps {
  openModal?: () => void;
}

const EmptyState: FC<EmptyStateProps> = ({ openModal }) => {
  const { isAdmin } = useRole();
  const showCreateAnnouncement = isAdmin && !!openModal;

  return (
    <div className="flex flex-col gap-2 justify-center items-center mt-4">
      {showCreateAnnouncement && (
        <div className="font-bold">Create Announcement</div>
      )}
      <p className="text-xs text-neutral-500">
        When announcements are created, they appear on this card
      </p>
      <div className="h-[107px]">
        <img src={NoAnnouncement} height={107} alt="No Announcement" />
      </div>
      {showCreateAnnouncement && (
        <>
          <Button
            variant={Variant.Secondary}
            size={Size.Small}
            className="py-[7px]"
            label="Create an announcement"
            onClick={() => {
              openModal();
            }}
          />
          <p className="text-xs text-neutral-500">Only admins can see this.</p>
        </>
      )}
    </div>
  );
};

export default EmptyState;
