import Divider from 'components/Divider';
import Icon from 'components/Icon';
import Link from 'components/Link';
import Modal from 'components/Modal';
import React, { ReactElement, useState } from 'react';
import SAMLDetail from './SAMLDetail';
import Collapse from 'components/Collapse';
import Button, { Type, Variant } from 'components/Button';
import { ISSOSetting } from '..';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Layout, { FieldType } from 'components/Form';
import { updateSso } from 'queries/organization';
import { useMutation } from '@tanstack/react-query';
import apiService from 'utils/apiService';
import Banner, { Variant as BannerVariant } from 'components/Banner';
import queryClient from 'utils/queryClient';
import useAuth from 'hooks/useAuth';
import { PRIMARY_COLOR } from 'utils/constants';

type ConfigureGenericSSOProps = {
  open: boolean;
  closeModal: () => void;
  ssoSetting?: ISSOSetting;
};

interface IForm {
  allowFallback: boolean;
  allowOnlyExistingUser: boolean;
  file: File;
}

const schema = yup.object({
  allowFallback: yup.boolean().default(false),
  allowOnlyExistingUser: yup.boolean().default(false),
});

const ConfigureGenericSSO: React.FC<ConfigureGenericSSOProps> = ({
  open,
  closeModal,
  ssoSetting,
}): ReactElement => {
  const { user } = useAuth();

  const { control, handleSubmit, getValues } = useForm<IForm>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });
  const fields = [
    {
      type: FieldType.Checkbox,
      label: 'Allow Auzmor Office to authenticate as a fallback mechanism',
      labelDescription:
        'When the LDAP is down, Auzmor Office can authenticate the user. Organization Primary Admin can control this behavior by enabling/disabling the flag.',
      name: 'allowFallback',
      control,
      defaultValue: ssoSetting?.allowFallback,
    },
    {
      type: FieldType.Checkbox,
      label: 'Allow only existing users to do SSO',
      labelDescription:
        'Enable this option when you do NOT want SSO to create a new user and strictly allow only existing users to login.',
      name: 'allowOnlyExistingUser',
      control,
      defaultValue: ssoSetting?.allowOnlyExistingUser,
    },
  ];

  const updateSsoMutation = useMutation({
    mutationKey: ['update-sso-mutation'],
    mutationFn: updateSso,
    onError: (error: any) => {
      console.log('Error while updating SSO: ', error);
    },
    onSuccess: async (response: any) => {
      console.log('Updated SSO successfully', response);
      await queryClient.invalidateQueries(['get-sso']);
      closeModal();
    },
  });

  const { isLoading, isError } = updateSsoMutation;

  const [xmlFile, setXmlFile] = useState<File[]>();

  const onSubmit = async () => {
    const values = getValues();
    const formData = new FormData();
    formData.append('active', 'true');
    formData.append('allowFallback', String(values.allowFallback || false));
    formData.append(
      'allowOnlyExistingUser',
      String(values.allowOnlyExistingUser || false),
    );
    if (xmlFile && xmlFile[0] && xmlFile[0]?.type == 'text/xml') {
      formData.append('file', new Blob(xmlFile, { type: 'application/xml' }));
    }

    apiService.updateContentType('multipart/form-data');
    if (ssoSetting) {
      const data = await updateSsoMutation.mutateAsync({
        idp: ssoSetting.idp,
        formData,
      });
    }
    apiService.updateContentType('application/json');
  };

  return (
    <Modal
      open={open}
      className="max-w-2xl max-h-[600px] overflow-y-visible overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <p className="font-extrabold text-black text-lg">{ssoSetting?.key}</p>
        <Icon
          onClick={closeModal}
          name="close"
          hover={false}
          stroke="#000"
          disabled
        />
      </div>

      <Divider className="!bg-neutral-100" />

      {/* Content */}
      <div className="mt-4 max-w-full">
        <p className="flex p-4 items-center text-sm font-normal text-neutral-500">
          Seamlessly control access to anyone in your organization.&nbsp;
          <Link label="Learn more." to="#" />
        </p>
        <p className="text-neutral-900 px-4 text-base font-bold mt-6">
          Details necessary to create your SAML application.
        </p>

        <div className="mt-2 px-4 bg-primary-50 rounded-9xl">
          <SAMLDetail
            prop="ACS URL"
            value={process.env.REACT_APP_ACS_URL || ''}
          />
          <SAMLDetail
            prop="Entity ID"
            value={process.env.REACT_APP_ENTITY_ID || ''}
          />
          <SAMLDetail
            prop="Relay State/Start URL"
            value={`{"domain": "${user?.organization.domain}"}`}
          />
        </div>

        <Divider className="!bg-neutral-100 my-8 px-4" />

        <div className="flex justify-between items-start px-4">
          <div>
            <p className="font-extrabold text-neutral-900 flex-col tex-base">
              Add metadata XML file
            </p>
            <p className="text-neutral-500 font-normal text-sm mt-1">
              This is required to enable SSO in your organization.
            </p>
            <p className="text-neutral-900 font-normal mt-4 text-sm">
              Important:&nbsp;
              <span className="font-bold">Upload Your XML File</span>
            </p>
          </div>

          {/* Upload XML  */}
          <label
            htmlFor="xml-file-input"
            className="flex cursor-pointer gap-x-2 px-4"
          >
            <input
              id="xml-file-input"
              type="file"
              className="hidden"
              accept="text/xml"
              onChange={(e) => {
                if (e.target.files?.length) {
                  setXmlFile(Array.prototype.slice.call(e.target.files));
                }
              }}
            />
            <div className="flex items-center gap-x-2">
              <Icon name="documentUpload" stroke={PRIMARY_COLOR} />
              <p className="text-primary-500 text-base">Upload Metadata Xml</p>
            </div>
          </label>
        </div>
        <Divider className="!bg-neutral-100 my-8 px-4" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-4">
            <Collapse label="Advanced Settings">
              <Layout fields={fields} />
            </Collapse>
          </div>
          {/* Footer */}
          <Banner
            variant={BannerVariant.Error}
            title={`Failed to integrate with ${ssoSetting?.key}. Please try again.`}
            className={`min-w-full ${
              isError && !isLoading ? 'visible' : 'invisible'
            } mt-4`}
          />
          <div className="bg-blue-50 p-0 rounded-b-9xl">
            <div className="p-3 flex items-center justify-end gap-x-3">
              <Button
                className="font-bold"
                label="Cancel"
                onClick={closeModal}
                variant={Variant.Secondary}
              />
              <Button
                className="font-bold"
                label="Done"
                variant={Variant.Primary}
                type={Type.Submit}
                loading={isLoading}
              />
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ConfigureGenericSSO;
