import EventCalendar from 'images/eventCalendar.svg';

const EmptyState = () => {
  const header = 'No upcoming events';
  return (
    <div className="py-6 px-4 flex flex-col items-center gap-2">
      <img
        src={EventCalendar}
        width={'132px'}
        height={'124px'}
        className="opacity-75"
        alt="No Events"
      />
      <div
        className="text-base font-bold line-clamp-2 text-neutral-900"
        tabIndex={0}
        title={header}
      >
        {header}
      </div>
    </div>
  );
};

export default EmptyState;
