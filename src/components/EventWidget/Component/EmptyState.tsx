import Button from 'components/Button';
import useRole from 'hooks/useRole';
import { getLearnUrl } from 'utils/misc';
import EventCalendar from 'images/eventCalendar.svg';

const EmptyState = () => {
  const { isAdmin } = useRole();
  const header = isAdmin ? 'Create an event' : 'Upcoming events';
  const footer = isAdmin
    ? 'Only admins can see this'
    : 'Upcoming events will appear here';
  return (
    <div className="py-6 px-4 flex flex-col items-center gap-2">
      <div className="text-base font-bold line-clamp-2 ">{header}</div>
      {isAdmin && (
        <div className="text-xs text-neutral-500 font-normal">
          When events are created, they appear on this card
        </div>
      )}
      <img src={EventCalendar} width={'132px'} height={'124px'} />
      {isAdmin && (
        <Button
          label={'Create an event'}
          className="w-full"
          onClick={() => {
            window.location.replace(`${getLearnUrl()}/events/create`);
          }}
        />
      )}

      <div className="text-xs font-normal">{footer}</div>
    </div>
  );
};

export default EmptyState;
