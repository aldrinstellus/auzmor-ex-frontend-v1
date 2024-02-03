import Icon from 'components/Icon';
import clsx from 'clsx';

const FinishSetup = () => {
  const steps = [
    {
      key: 'cover_photo',
      label: 'Add a cover photo',
      completed: false,
      icon: 'image',
    },
    {
      key: 'description',
      label: 'Add description',
      completed: true,
      icon: 'image',
    },
    {
      key: 'invite',
      label: 'Invite members',
      completed: false,
      icon: 'image',
    },
    {
      key: 'post',
      label: 'Create post',
      completed: false,
      icon: 'image',
    },
  ];

  return (
    <div className="bg-white rounded-9xl p-6 mt-6">
      <div className="flex justify-between">
        <div className="font-bold text-neutral-900">Finish setting up</div>
        <Icon name="close" size={20} />
      </div>
      <div>
        <div className="mt-2 text-sm text-neutral-400">
          <span className="!text-primary-500 font-semibold">
            {steps.filter((s) => s.completed).length} of {steps.length}
          </span>{' '}
          steps completed
        </div>
        <div className="mt-2">
          {steps.map((step) => (
            <div
              key={step.key}
              className={clsx(
                {
                  'border rounded-19xl px-5 py-3 mb-2 font-medium flex justify-between':
                    true,
                },
                {
                  'bg-primary-50 text-neutral-500 line-through': step.completed,
                },
                {
                  'text-neutral-900 cursor-pointer': !step.completed,
                },
              )}
            >
              <div className="flex items-center space-x-2">
                <Icon name={step.icon} size={16} />
                <div className="text-sm ">{step.label}</div>
              </div>
              {step.completed && (
                <Icon
                  name="tickCircle"
                  className="text-primary-500"
                  size={16}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinishSetup;
