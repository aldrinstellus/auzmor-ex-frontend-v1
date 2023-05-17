import Button, { Variant as ButtonVariant } from 'components/Button';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import React, { useContext } from 'react';
import { FieldValues, UseFormHandleSubmit } from 'react-hook-form';

export interface IFooterProps {
  handleSubmit: UseFormHandleSubmit<FieldValues>;
}

const Footer: React.FC<IFooterProps> = ({ handleSubmit }) => {
  const { setAnnouncement, setActiveFlow, clearPostContext } =
    useContext(CreatePostContext);
  const onSubmit = (data: any) => {
    setAnnouncement({
      label: data.expityOption.label,
      value: data.expityOption.value,
    });
    setActiveFlow(CreatePostFlow.CreatePost);
  };
  return (
    <div className="flex justify-end items-center h-16 p-6 bg-blue-50">
      <Button
        variant={ButtonVariant.Secondary}
        label="Back"
        className="mr-3"
        onClick={() => setActiveFlow(CreatePostFlow.CreatePost)}
      />
      <Button label={'Next'} onClick={handleSubmit(onSubmit)} />
    </div>
  );
};

export default Footer;
