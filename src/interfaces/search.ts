export enum ISearchResultType {
  APP = 'app',
  CHANNEL = 'channel',
  COURSE = 'course',
  DOCUMENT = 'document',
  EVENT = 'event',
  KEYWORD = 'keyword',
  MENTORSHIP = 'mentorship',
  PATH = 'path',
  PEOPLE = 'people',
  TASK = 'task',
  TEAM = 'team',
}

export type ISearchResult = Record<string, any>;

export interface ISearchResultGroup {
  module: ISearchResultType;
  name: string;
  results: ISearchResult[];
}
