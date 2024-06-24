import { pageTitleMappings } from 'utils/pageTitleMapping';
import useAuth from './useAuth';

export const usePageTitle = (key: string) => {
  const { user } = useAuth();
  try {
    document.title = `${pageTitleMappings[key].title} - ${user?.organization?.name}`;
    (document.getElementsByTagName('meta') as any)['description'] =
      pageTitleMappings[key].description;
  } catch (error) {}
};
