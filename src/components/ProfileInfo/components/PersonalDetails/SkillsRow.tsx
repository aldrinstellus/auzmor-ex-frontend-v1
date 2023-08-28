import React, { useRef } from 'react';
import InfoRow from '../InfoRow';
import 'moment-timezone';
import Button, { Size, Variant } from 'components/Button';
import useModal from 'hooks/useModal';
import SkillsModal from './SkillsModal';

type AppProps = {
  data: any;
};

const SkillsRow: React.FC<AppProps> = ({ data }) => {
  const ref = useRef<any>(null);
  const [openSkills, openSkillsModal, closeSkillsModal] = useModal();

  return (
    <>
      <InfoRow
        ref={ref}
        icon={{
          name: 'edit',
          color: 'text-primary-500',
          bgColor: 'text-primary-50',
        }}
        label="Skills"
        canEdit={false}
        value={
          <div className="flex items-center flex-wrap">
            {data?.personal?.skills.map((skill: string, index: number) => (
              <div
                key={skill}
                data-testid={`personal-details-skill-${skill}`}
                className="bg-primary-50 text-primary-500 flex justify-center items-center px-2 py-2 text-xs rounded-16xl mr-2"
              >
                {skill}
              </div>
            ))}
            <div>
              <Button
                label="Add Skills"
                variant={Variant.Secondary}
                size={Size.ExtraSmall}
                leftIcon="add"
                leftIconSize={16}
                onClick={openSkillsModal}
              />
            </div>
          </div>
        }
        dataTestId="added-skills"
      />
      <SkillsModal
        open={openSkills}
        closeModal={closeSkillsModal}
        skills={data?.personal?.skills || []}
      />
    </>
  );
};

export default SkillsRow;
