import { DocumentPathContext } from 'contexts/DocumentPathContext';
import { useContext } from 'react';

export const useDocumentPath = () => {
  return useContext(DocumentPathContext);
};
