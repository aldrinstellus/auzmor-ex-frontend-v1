import Button, { Variant as ButtonVariant, Type } from 'components/Button';
import { CreatePostContext, CreatePostFlow } from 'contexts/CreatePostContext';
import React, { useContext } from 'react';
import { UseFormHandleSubmit } from 'react-hook-form';
import { IForm } from '.';

interface IFooter {
  isValid: boolean;
}

const Footer: React.FC<IFooter> = ({ isValid }) => {
  const { setActiveFlow } = useContext(CreatePostContext);
  return (
    <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-19xl">
      <div className="flex">
        <Button
          variant={ButtonVariant.Secondary}
          label="Back"
          className="mr-3"
          onClick={() => setActiveFlow(CreatePostFlow.CreatePost)}
          dataTestId="scheduledpost-back"
        />
        <Button
          label={'Next'}
          type={Type.Submit}
          dataTestId="scheduledpost-next"
          disabled={!isValid}
        />
      </div>
    </div>
  );
};

export default Footer;
