import UploadFileStep from './UploadFileStep';
import ImportingFileStep from './ImportingFileStep';
import SelectSheetStep from './SelectSheetStep';
import ReviewStep from './ReviewStep';
import ConfirmationStep from './ConfirmationStep';

export enum StepEnum {
  Upload = 'upload',
  Importing = 'importing',
  SelectSheet = 'select_sheet',
  Review = 'review',
  Confirmation = 'confirmation',
}

export const stepMap = {
  [StepEnum.Upload]: UploadFileStep,
  [StepEnum.Importing]: ImportingFileStep,
  [StepEnum.SelectSheet]: SelectSheetStep,
  [StepEnum.Review]: ReviewStep,
  [StepEnum.Confirmation]: ConfirmationStep,
};
