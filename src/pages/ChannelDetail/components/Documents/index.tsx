import React, { FC, Fragment, useState } from 'react';
import Card from 'components/Card';
import Button, { Size as ButtonSize } from 'components/Button';
import { useForm } from 'react-hook-form';
import Layout, { FieldType } from 'components/Form';
import { Variant as InputVariant, Size as InputSize } from 'components/Input';
import { useTranslation } from 'react-i18next';
import Folder, { FolderType } from './Folder';
import Doc, { DocType } from './Doc';
import { FILES } from 'mocks/files';
import { FOLDERS } from 'mocks/folders';

interface IDocumentProps {}

const Document: FC<IDocumentProps> = ({}) => {
  const { t } = useTranslation('common');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { control, getValues, formState } = useForm<{
    search: string;
    expiryOption: {
      label: string;
      value: string;
      dataTestId: string;
    };
  }>({
    mode: 'onChange',
    defaultValues: { search: '' },
  });

  const ConnectionCard = () => {
    return (
      <Card className="flex flex-col w-full items-center justify-center bg-white p-8 gap-6">
        <p className="test-sm text-neutral-500 text-center">
          Connection not made yet <br />
          Please connect document source first...!
        </p>
        <Button
          label="Connect +"
          onClick={() => {
            setIsConnected(true);
          }}
        />
      </Card>
    );
  };

  const FilterMenu = () => {
    return (
      <Card className="flex justify-between items-center p-4 relative">
        <div className="flex justify-between items-center gap-6">
          <Layout
            fields={[
              {
                type: FieldType.Input,
                variant: InputVariant.Text,
                size: InputSize.Small,
                leftIcon: 'search',
                control,
                getValues,
                name: 'search',
                placeholder: 'Search documents' || t('search'),
                error: formState.errors.search?.message,
                dataTestId: 'document-search',
                inputClassName: 'py-[7px] !text-sm !h-9',
                isClearable: true,
              },
            ]}
          />
          <div className="flex items-center gap-4">
            <div className="flex">
              <div className="px-4 py-1 rounded-l-16xl border border-neutral-300 bg-neutral-100 text-sm text-neutral-700 w-24 text-center cursor-pointer">
                Files
              </div>
              <div className="px-4 py-1 rounded-r-16xl border border-neutral-300 bg-neutral-100 text-sm text-neutral-700 w-24 text-center cursor-pointer">
                Folders
              </div>
            </div>
            <div className="px-4 py-1 rounded-16xl border border-neutral-300 bg-neutral-100 text-sm text-neutral-700 w-24 text-center cursor-pointer">
              Starred
            </div>
            <Layout
              fields={[
                {
                  type: FieldType.SingleSelect,
                  name: 'expiryOption',
                  control,
                  options: [
                    {
                      label: 'PDF',
                      value: 'pdf',
                      dataTestId: 'doc-type-pdf',
                    },
                    {
                      label: 'Excel',
                      value: 'excel',
                      dataTestId: 'doc-type-excel',
                    },
                    {
                      label: 'PPT',
                      value: 'ppt',
                      dataTestId: 'doc-type-ppt',
                    },
                    {
                      label: 'Word',
                      value: 'word',
                      dataTestId: 'doc-type-word',
                    },
                    {
                      label: 'Other',
                      value: 'other',
                      dataTestId: 'doc-type-other',
                    },
                  ],
                  placeholder: 'Document Type',
                  dataTestId: 'doc-type-dropdown',
                  height: 32,
                  showSearch: false,
                  className: 'w-32',
                },
              ]}
            />
          </div>
        </div>
        <div>
          <Button label="+ Upload new" size={ButtonSize.Small} />
        </div>
        <div className="absolute right-0 -bottom-12">
          <div className="flex items-center gap-2">
            <div className="bg-white grid grid-cols-2 place-content-center gap-1 p-2 rounded">
              <div className="w-2 h-2 border border-primary-500 rounded-sm" />
              <div className="w-2 h-2 border border-primary-500 rounded-sm" />
              <div className="w-2 h-2 border border-primary-500 rounded-sm" />
              <div className="w-2 h-2 border border-primary-500 rounded-sm" />
            </div>
            <div className="bg-white flex flex-col p-2 rounded gap-1 hover:shadow-sm cursor-pointer group/col">
              <div className="w-3 h-2 border-2 border-neutral-500 rounded-lg group-hover/col:border-primary-500" />
              <div className="w-4 h-2 border-2 border-neutral-500 rounded-lg group-hover/col:border-primary-500" />
            </div>
          </div>
        </div>
      </Card>
    );
  };

  if (!isConnected) {
    return <ConnectionCard />;
  }

  return (
    <Fragment>
      <FilterMenu />
      <div className="flex flex-col gap-4">
        <p className="font-bold text-neutral-900 text-lg">Folders</p>
        <div className="grid grid-cols-3 gap-6 justify-items-center lg:grid-cols-3 1.5lg:grid-cols-4 1.5xl:grid-cols-5 2xl:grid-cols-5">
          {FOLDERS.map((folder: FolderType) => (
            <Folder key={folder.id} folder={folder} />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <p className="font-bold text-neutral-900 text-lg">Recently updated</p>
        <div className="grid grid-cols-3 gap-6 justify-items-center lg:grid-cols-3 1.5lg:grid-cols-4 1.5xl:grid-cols-5 2xl:grid-cols-5">
          {FILES.map((file: DocType) => (
            <Doc key={file.id} file={file} />
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default Document;
