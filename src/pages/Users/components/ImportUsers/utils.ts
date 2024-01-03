import UploadFileStep from './UploadFileStep';
import SelectSheetStep from './ImportFileStep/SelectSheetStep';
import ReviewStep from './ReviewStep';
import ConfirmationStep from './ConfirmationStep';
import ImportFileStep from './ImportFileStep';

export enum StepEnum {
  Upload = 'upload',
  Importing = 'importing',
  SelectSheet = 'select_sheet',
  Review = 'review',
  Confirmation = 'confirmation',
}

export const stepMap = {
  [StepEnum.Upload]: UploadFileStep,
  [StepEnum.Importing]: ImportFileStep,
  [StepEnum.SelectSheet]: SelectSheetStep,
  [StepEnum.Review]: ReviewStep,
  [StepEnum.Confirmation]: ConfirmationStep,
};
