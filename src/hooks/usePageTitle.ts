import useAuth from './useAuth';
import { usePageTitleMappings } from './usePageTitleMapping';

export const usePageTitle = (key: string) => {
  const { user } = useAuth();
  const pageTitleMappings = usePageTitleMappings();
  try {
    document.title = `${pageTitleMappings[key].title} - ${
      user?.organization?.name || 'Auzmor Office'
    }`;
    (document.getElementsByTagName('meta') as any)['description'] =
      pageTitleMappings[key].description;
  } catch (error) {}
};
