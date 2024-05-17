import Icon from 'components/Icon';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

const FinishSetup = () => {
  const { t } = useTranslation('channelDetail');

  const steps = [
    {
      key: 'cover_photo',
      label: t('setup.cover_photo'),
      completed: false,
      icon: 'image',
      dataTestId: 'add-coverphoto',
    },
    {
      key: 'description',
      label: t('setup.description'),
      completed: true,
      icon: 'image',
      dataTestId: 'add-description',
    },
    {
      key: 'invite',
      label: t('setup.invite'),
      completed: false,
      icon: 'image',
      dataTestId: 'invite-member',
    },
    {
      key: 'post',
      label: t('setup.post'),
      completed: false,
      icon: 'image',
      dataTestId: 'createposts',
    },
  ];

  return (
    <div
      className="bg-white rounded-9xl p-6 mt-6"
      data-testid="channel-settingup-steps-post"
    >
      <div className="flex justify-between">
        <div className="font-bold text-neutral-900">{t('setup.title')}</div>
        <Icon
          name="close"
          size={20}
          dataTestId="channel-settingpost-crossicon"
        />
      </div>
      <div>
        <div className="mt-2 text-sm text-neutral-400">
          <span className="!text-primary-500 font-semibold">
            {steps.filter((s) => s.completed).length} {t('setup.of')}{' '}
            {steps.length}
          </span>{' '}
          {t('setup.steps_completed')}
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
              data-testid={`channel-${step.dataTestId}-step`}
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
                  dataTestId={`channel-${step.dataTestId}-greenmark`}
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
