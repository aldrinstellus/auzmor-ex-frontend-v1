import Card from 'components/Card';
import Divider from 'components/Divider';
import React from 'react';

export interface IAboutMeProps {}

const AboutMe: React.FC<IAboutMeProps> = () => {
  return (
    <Card>
      <div className="text-neutral-900 font-bold text-base px-6 pt-6 pb-4">
        About me
      </div>
      <Divider />
      <div className="text-neutral-900 text-sm font-normal px-6 pt-4 pb-6">
        Groth and comfont
      </div>
    </Card>
  );
};

export default AboutMe;
