import Card from 'components/Card';
import Divider from 'components/Divider';
import React from 'react';

export interface IAboutMeProps {
  aboutMe: string;
}

const AboutMe: React.FC<IAboutMeProps> = ({ aboutMe }) => {
  return (
    <Card className="mb-8">
      <div className="text-neutral-900 font-bold text-base px-6 pt-6 pb-4">
        About me
      </div>
      <Divider />
      <div className="text-neutral-900 text-sm font-normal px-6 pt-4 pb-6">
        {aboutMe}
      </div>
    </Card>
  );
};

export default AboutMe;
