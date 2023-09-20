import { FC, useRef } from 'react';
import InfoRow from '../InfoRow';
import 'moment-timezone';
import Button, { Size, Variant } from 'components/Button';
import useModal from 'hooks/useModal';
import SkillsModal from './SkillsModal';
import { useParams } from 'react-router-dom';
import useRole from 'hooks/useRole';
import useAuth from 'hooks/useAuth';

type AppProps = {
  data: any;
};

const SkillsRow: FC<AppProps> = ({ data }) => {
  const { userId = '' } = useParams();
  const ref = useRef<any>(null);
  const [openSkills, openSkillsModal, closeSkillsModal] = useModal();
  const { user } = useAuth();
  const { isOwnerOrAdmin } = useRole({ userId: userId || user?.id });

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
            {data?.personal?.skills?.map((skill: string, _index: number) => (
              <div
                key={skill}
                data-testid={`personal-details-skill-${skill}`}
                className="bg-primary-50 text-primary-500 flex justify-center items-center px-2 py-2 text-xs rounded-16xl mr-2"
              >
                {skill}
              </div>
            ))}
            {isOwnerOrAdmin && (
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
            )}
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
