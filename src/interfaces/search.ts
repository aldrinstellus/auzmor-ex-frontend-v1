export enum ISearchResultType {
  APP = 'app',
  CHANNEL = 'channel',
  COURSE = 'course',
  DOCUMENT = 'document',
  EVENT = 'event',
  KEYWORD = 'keyword',
  MENTORSHIP = 'mentorship',
  PATH = 'path',
  LEARNING_PATH = 'learningpath',
  PEOPLE = 'people',
  RECENT = 'recent',
  TASK = 'task',
  TEAM = 'team',
  USER = 'user',
}

export type ISearchResult = Record<string, any>;

export interface ISearchResultGroup {
  module: ISearchResultType;
  name: string;
  isLoading?: boolean;
  results: ISearchResult[];
}
