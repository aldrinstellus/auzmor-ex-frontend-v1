import { FC } from 'react';

interface IPollOptionTabProps {
  postId: string;
  optionId?: string;
}

const PollOptionTab: FC<IPollOptionTabProps> = ({ postId, optionId }) => {
  console.log({ postId, optionId });
  return <div />;
};

export default PollOptionTab;
