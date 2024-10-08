export interface ICategory {
  id: string;
  name: string;
}

export enum CategoryType {
  APP = 'APP',
  TEAM = 'TEAM',
  CHANNEL = 'CHANNEL',
}

export interface ICategoryDetail {
  name: string;
  type?: string;
  id: string;
  value?: string;
  label?: string;
  isNew?: boolean;
}
