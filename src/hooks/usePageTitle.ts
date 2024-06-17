import { pageTitleMappings } from 'utils/pageTitleMapping';

export const usePageTitle = (key: string) => {
  try {
    document.title = pageTitleMappings[key].title;
    (document.getElementsByTagName('meta') as any)['description'] =
      pageTitleMappings[key].description;
  } catch (error) {}
};
