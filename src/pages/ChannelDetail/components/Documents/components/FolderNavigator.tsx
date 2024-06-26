import React, { FC, Fragment, useCallback } from 'react';
import Header from './Header';
import { useDocumentPath } from 'hooks/useDocumentPath';
import Folder, { FolderType } from './Folder';
import Doc from './Doc';
import { useFiles, useFolders } from 'queries/storage';
import Skeleton from 'react-loading-skeleton';
import Card from 'components/Card';
import Button, { Variant } from 'components/Button';
import { DocType } from 'queries/files';
import { useAppliedFiltersForDoc } from 'stores/appliedFiltersForDoc';
import moment from 'moment';

interface IFolderNavigatorProps {
  showFiles: boolean;
  showFolders: boolean;
}

const FolderNavigator: FC<IFolderNavigatorProps> = ({
  showFiles,
  showFolders,
}) => {
  const { path, appendFolder } = useDocumentPath();
  const { filters } = useAppliedFiltersForDoc();

  const getFolderId: () => string | null = useCallback(() => {
    if (path.length <= 1) {
      return null;
    }
    return path[path.length - 1].id;
  }, [path]);

  // Fetch folder data
  const { data: folderData, isLoading: folderLoading } = useFolders({
    parentFolderId: getFolderId(),
  });
  const folders = (folderData?.data?.result?.data || []).filter(
    (folder: FolderType) => {
      if (!!filters?.docModifiedCheckbox?.length) {
        const dateString = filters.docModifiedCheckbox[0].value;
        if (moment(folder.modifiedAt).isAfter(dateString)) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
  );

  // fetch files data
  const { data: fileData, isLoading: fileLoading } = useFiles({
    folderId: getFolderId(),
  });
  const files = (fileData?.data?.result?.data || [])
    .filter((file: DocType) => {
      const typeFilters =
        filters?.docTypeCheckbox?.map((type: any) => type.value)?.flat() || [];
      if (typeFilters.length > 0) {
        return typeFilters.includes(file.mimeType);
      }
      return true;
    })
    .filter((file: DocType) => {
      if (!!filters?.docModifiedCheckbox?.length) {
        const dateString = filters.docModifiedCheckbox[0].value;
        console.log(dateString, file.modifiedAt);
        if (moment(file.modifiedAt).isAfter(dateString)) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    });

  const EmptyState = () => {
    return (
      <div className="flex flex-col w-full justify-center items-center gap-4">
        <div className="flex w-full justify-center">
          <img src={require('images/noResult.png')} alt="No Result" />
        </div>
        <p className="font-bold text-xl text-neutral-900">No documents found</p>
        <Button
          label="Upload now"
          variant={Variant.Secondary}
          className="text-base font-semibold !text-neutral-500 hover:!text-primary-500"
        />
      </div>
    );
  };

  const Folders: FC = () => {
    const FolderSkeleton = () => {
      return (
        <Card className="p-4 bg-white flex w-64">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12">
              <Skeleton className="h-full" />
            </div>
            <div className="flex flex-col justify-between w-40">
              <Skeleton />
              <div className="flex items-center gap-2 w-full">
                <Skeleton width={32} />
                <div className="w-1 h-1 flex rounded-full bg-neutral-300"></div>
                <Skeleton width={32} />
              </div>
            </div>
          </div>
        </Card>
      );
    };

    if (!folderLoading && folders?.length === 0) {
      return <></>;
    }

    return (
      <div className="flex flex-col gap-4">
        <p className="font-bold text-neutral-900 text-lg">Folders</p>
        {folderLoading ? (
          <div className="grid grid-cols-3 gap-6 justify-items-center lg:grid-cols-3 1.5lg:grid-cols-4 1.5xl:grid-cols-5 2xl:grid-cols-5">
            {[...Array(5)].map((index) => (
              <FolderSkeleton key={index} />
            ))}
          </div>
        ) : folders?.length > 0 ? (
          <div className="grid grid-cols-3 gap-6 justify-items-center lg:grid-cols-3 1.5lg:grid-cols-4 1.5xl:grid-cols-5 2xl:grid-cols-5">
            {folders.map((folder: FolderType) => (
              <Folder
                key={folder.id}
                folder={folder}
                onClick={() =>
                  appendFolder({ id: folder.id || '', label: folder.name })
                }
              />
            ))}
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  };

  const Files: FC = () => {
    const FileSkeleton = () => {
      return (
        <Card className="p-4 bg-white flex flex-col w-64 gap-4">
          <div className="border border-neutral-300 overflow-hidden rounded-7xl w-full h-28">
            <Skeleton className="w-full h-full" height={112} />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 items-center flex">
              <Skeleton width={24} height={24} />
            </div>
            <Skeleton width={190} />
          </div>
        </Card>
      );
    };

    if (!fileLoading && files?.length === 0) {
      return <></>;
    }

    return (
      <div className="flex flex-col gap-4">
        <p className="font-bold text-neutral-900 text-lg">Files</p>
        {fileLoading ? (
          <div className="grid grid-cols-3 gap-6 justify-items-center lg:grid-cols-3 1.5lg:grid-cols-4 1.5xl:grid-cols-5 2xl:grid-cols-5">
            {[...Array(5)].map((index) => (
              <FileSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6 justify-items-center lg:grid-cols-3 1.5lg:grid-cols-4 1.5xl:grid-cols-5 2xl:grid-cols-5">
            {files.map((file: DocType) => (
              <Doc key={file.id} file={file} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Fragment>
      {path.length > 1 && <Header />}
      {showFolders && <Folders />}
      {showFiles && <Files />}
      {files.length + folders.length <= 0 && !fileLoading && !folderLoading && (
        <EmptyState />
      )}
    </Fragment>
  );
};

export default FolderNavigator;
