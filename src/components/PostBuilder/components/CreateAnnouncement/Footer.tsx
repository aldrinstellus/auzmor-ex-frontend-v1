import Button, { Variant as ButtonVariant } from 'components/Button';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import React, { useContext } from 'react';
import { FieldValues, UseFormHandleSubmit } from 'react-hook-form';
import { afterXUnit } from 'utils/time';

export interface IFooterProps {
  handleSubmit: UseFormHandleSubmit<FieldValues>;
  isValid: boolean;
}

const Footer: React.FC<IFooterProps> = ({ handleSubmit, isValid }) => {
  const { setAnnouncement, setActiveFlow, announcement } =
    useContext(CreatePostContext);
  const onSubmit = (data: any) => {
    setAnnouncement({
      label: data?.expityOption?.label || announcement?.label || '1 Week',
      value:
        data?.expityOption?.value ||
        announcement?.value ||
        afterXUnit(1, 'weeks').toISOString().substring(0, 19) + 'Z',
    });
    setActiveFlow(CreatePostFlow.CreatePost);
  };
  return (
    <div className="flex justify-between items-center h-16 p-6 bg-blue-50">
      <Button
        variant={ButtonVariant.Secondary}
        label="Clear"
        className="mr-3"
        onClick={() => {
          setAnnouncement(null);
          setActiveFlow(CreatePostFlow.CreatePost);
        }}
        dataTestId="announcement-clear"
      />

      <div className="flex">
        <Button
          variant={ButtonVariant.Secondary}
          label="Back"
          className="mr-3"
          onClick={() => setActiveFlow(CreatePostFlow.CreatePost)}
          dataTestId="announcement-expiry-backcta"
        />
        <Button
          label={'Next'}
          onClick={handleSubmit(onSubmit)}
          dataTestId="announcement-expiry-nextcta"
          disabled={!isValid}
        />
      </div>
    </div>
  );
};

export default Footer;
