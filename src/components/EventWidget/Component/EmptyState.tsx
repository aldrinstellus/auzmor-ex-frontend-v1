import EventCalendar from 'images/eventCalendar.svg';

const EmptyState = () => {
  const header = 'Upcoming events';
  const footer = 'Upcoming events will appear here';
  return (
    <div className="py-6 px-4 flex flex-col items-center gap-2">
      <div className="text-base font-bold line-clamp-2 ">{header}</div>
      <img
        src={EventCalendar}
        width={'132px'}
        height={'124px'}
        className="opacity-75"
      />
      <div className="text-xs font-normal">{footer}</div>
    </div>
  );
};

export default EmptyState;
