import IconButton, {
  Size,
  Variant as IconVariant,
} from 'components/IconButton';
import Button, {
  Variant as ButtonVariant,
  Type as ButtonType,
} from 'components/Button';
import { Variant as InputVariant } from 'components/Input';
import Modal from 'components/Modal';
import { ISkillDetail, useInfiniteSkills } from 'queries/skills';

import { ISkillsOption } from '../PersonalDetails';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Icon from 'components/Icon';
import { updateCurrentUser } from 'queries/users';
import { twConfig } from 'utils/misc';
import { toastConfig } from '../utils';
import { FC, useEffect } from 'react';
export interface ISkillsModalProps {
  open: boolean;
  closeModal: () => void;
  skills: ISkillsOption[];
}

const SkillsModal: FC<ISkillsModalProps> = ({ open, closeModal, skills }) => {
  const queryClient = useQueryClient();

  const updateUserSkillsMutation = useMutation({
    mutationFn: updateCurrentUser,
    mutationKey: ['update-user-skills-mutation'],
    onError: (_error: any) => {},
    onSuccess: async (_response: any) => {
      toastConfig(
        <Icon
          name="closeCircleOutline"
          color={twConfig.theme.colors.primary['500']}
          size={20}
        />,
      );
      closeModal();
      await queryClient.invalidateQueries(['current-user-me']);
    },
  });

  const { handleSubmit, reset, control } = useForm<any>({
    mode: 'onSubmit',
    defaultValues: {
      personal: {
        skills: skills?.map(
          (skill) =>
            ({
              label: skill,
              value: skill,
            } || []),
        ),
      },
    },
  });

  useEffect(() => {
    reset({ skills: skills.map((s) => ({ label: s, value: s })) });
  }, [skills]);

  const onSubmit = (formData: any) => {
    updateUserSkillsMutation.mutate({
      personal: { skills: formData?.skills?.map((s: any) => s.label) },
    });
  };

  const formatSkills = (data: any) => {
    const skillsData = data?.pages.flatMap((page: any) => {
      return page?.data?.result?.data.map((skill: any) => {
        try {
          return { ...skill, label: skill.name };
        } catch (e) {
          console.log('Error', { skill });
        }
      });
    });

    const transformedOption = skillsData?.map((skill: ISkillDetail) => ({
      value: skill?.name,
      label: skill?.name,
      id: skill?.id,
      dataTestId: `skill-option-${skill?.name}`,
    }));
    return transformedOption;
  };

  const skillField = [
    {
      type: FieldType.CreatableSearch,
      variant: InputVariant.Text,
      placeholder: 'Start typing for suggestions',
      name: 'skills',
      label: 'Add Skills',
      required: false,
      control,
      // defaultValue: defaultValues()?.skills,
      fetchQuery: useInfiniteSkills,
      getFormattedData: formatSkills,
      // error: errors.skills?.message,
      dataTestId: 'select-skills',
      getPopupContainer: document.body,
      multi: true,
    },
  ];

  const Header: FC = () => (
    <div className="flex flex-wrap items-center p-4 space-x-3 border-neutral-100 border-b-1">
      <div className="text-lg text-neutral-900 font-extrabold flex-auto">
        Add your skills
      </div>
      <IconButton
        onClick={closeModal}
        icon={'close'}
        dataTestId="reactivate-user-close"
        className="!flex-[0] !text-right !bg-inherit !p-1"
        color="text-neutral-900"
        variant={IconVariant.Primary}
      />
    </div>
  );

  const Footer: FC = () => (
    <div className="flex justify-end space-x-3 items-center h-16 p-6 bg-blue-50 rounded-b-9xl border-neutral-100 border-t-1">
      <Button
        variant={ButtonVariant.Secondary}
        size={Size.Small}
        label={'Cancel'}
        dataTestId="cancel-cta"
        onClick={closeModal}
      />
      <Button
        label={'Save'}
        className="bg-primary-500 !text-white flex"
        size={Size.Small}
        type={ButtonType.Submit}
        dataTestId="save-cta"
        onClick={handleSubmit(onSubmit)}
      />
    </div>
  );

  return (
    <Modal
      open={open}
      className="max-w-2xl top-36"
      dataTestId="add-skills-modal"
    >
      <Header />
      <div className="flex flex-col space-y-4 text-sm font-medium text-[#171717] px-6 py-4">
        <form>
          <Layout fields={skillField} />
        </form>

        {/* <div className="flex flex-col space-y-4">
          <div className="font-bold">Recommeded based on your profile</div>
          <div>Skills List</div>
        </div> */}
      </div>
      <Footer />
    </Modal>
  );
};

export default SkillsModal;
