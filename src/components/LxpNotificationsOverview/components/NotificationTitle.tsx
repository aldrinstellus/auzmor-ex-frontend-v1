import { useNavigate } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { getLearnUrl } from 'utils/misc';
import NotificationText from './NotificationText';

const NotificationTitle = ({
  linkTo,
  i18nKey,
  values,
  components,
  isLxpRoute,
}: any) => {
  const { t } = useTranslation('learnNotifications');
  const navigate = useNavigate();
  const handleClick = () => {
    if (isLxpRoute) {
      navigate(`${linkTo}`);
    } else if (linkTo) {
      window.location.assign(`${getLearnUrl(`${linkTo}`)}`);
    }
  };

  return (
    <p
      className={`!leading-[18px] !text-[13px] ${
        linkTo ? 'cursor-pointer' : ''
      }`}
      onClick={handleClick}
    >
      <NotificationText as="p">
        <Trans
          i18nKey={i18nKey}
          t={t}
          values={values}
          components={components}
        />
      </NotificationText>
    </p>
  );
};

export default NotificationTitle;
