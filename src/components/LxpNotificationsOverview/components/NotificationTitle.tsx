import { useNavigate } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { getLearnUrl } from 'utils/misc';
import NotificationText from './NotificationText';

const NotificationTitle = ({
  linkTo,
  i18nKey,
  values,
  components,
  isLxpRoute,
}: any) => {
  console.log('linkTo :', linkTo);
  const navigate = useNavigate();
  const handleClick = () => {
    if (isLxpRoute) {
      navigate(`/${linkTo}`);
    } else {
      window.location.assign(`${getLearnUrl(`${linkTo}`)}`);
    }
  };

  return (
    <div className={linkTo ? 'cursor-pointer' : ''} onClick={handleClick}>
      <NotificationText as="p">
        <Trans i18nKey={i18nKey} values={values} components={components} />
      </NotificationText>
    </div>
  );
};

export default NotificationTitle;
