import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import React, { useContext } from 'react';
import {
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import IconButton, { Variant as IconVariant } from 'components/IconButton';
import { twConfig } from 'utils/misc';
import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
} from 'components/Button';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import { afterXUnit } from 'utils/time';
import Header from '../Header';
import Footer from './Footer';
import Body from './Body';

export interface ICreateAnnouncementProps {
  closeModal: () => void;
}

const CreateAnnouncement: React.FC<ICreateAnnouncementProps> = ({
  closeModal,
}) => {
  const { setActiveFlow, announcement, clearPostContext } =
    useContext(CreatePostContext);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: 'onChange',
  });

  const selecetedExpiry = watch('expityOption');
  return (
    <>
      <Header
        title={'Create an announcement'}
        onBackIconClick={() => setActiveFlow(CreatePostFlow.CreatePost)}
        onClose={() => {
          clearPostContext();
          closeModal();
        }}
      />
      <Body
        selecetedExpiry={selecetedExpiry}
        fields={[
          {
            type: FieldType.SingleSelect,
            name: 'expityOption',
            control,
            options: [
              {
                label: '1 Day',
                value:
                  afterXUnit(1, 'days').toISOString().substring(0, 19) + 'Z',
              },
              {
                label: '1 Week',
                value:
                  afterXUnit(1, 'weeks').toISOString().substring(0, 19) + 'Z',
              },
              {
                label: '2 Weeks',
                value:
                  afterXUnit(2, 'weeks').toISOString().substring(0, 19) + 'Z',
              },
              {
                label: '1 Month',
                value:
                  afterXUnit(1, 'months').toISOString().substring(0, 19) + 'Z',
              },
              { label: 'Custom Date', value: '' },
            ],
            defaultValue: announcement,
          },
        ]}
      />
      <Footer handleSubmit={handleSubmit} />
    </>
  );
};

export default CreateAnnouncement;
