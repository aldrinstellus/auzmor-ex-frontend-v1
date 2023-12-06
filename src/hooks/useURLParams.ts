import { useSearchParams } from 'react-router-dom';

interface UseURLParamsHook {
  searchParams: any;
  updateParam: (key: string, value: string, replace?: boolean) => void;
  deleteParam: (key: string) => void;
  parseParams: (key: string) => any;
  serializeFilter: (filter: any) => string;
}

const useURLParams = (): UseURLParamsHook => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateParam = (key: string, value: string, replace = false) => {
    setSearchParams(
      (params) => {
        params.set(key, value);
        return params;
      },
      { replace },
    );
  };

  const deleteParam = (key: string) => {
    if (searchParams.get(key)) {
      setSearchParams((params) => {
        params.delete(key);
        return params;
      });
    }
  };

  const serializeFilter = (filter: any) => {
    const serializedFilters = encodeURIComponent(JSON.stringify(filter));
    return serializedFilters;
  };

  const parseParams = (key: string) => {
    const searchParams = new URLSearchParams(location.search);
    const serializedFilters = searchParams.get(key);
    if (serializedFilters) {
      try {
        const parsedFilters = JSON.parse(decodeURIComponent(serializedFilters));
        return parsedFilters;
      } catch (serializedFilters) {
        deleteParam(key);
        return null;
      }
    }
  };

  return {
    searchParams,
    updateParam,
    deleteParam,
    serializeFilter,
    parseParams,
  };
};

export default useURLParams;
