import Button, { Variant as ButtonVariant } from 'components/Button';
import Card from 'components/Card';
import React, { useState } from 'react';
import AppsBanner from 'images/appsBanner.png';
import IconButton, {
  Variant as IconVariant,
  Size as IconSize,
} from 'components/IconButton';
import Layout, { FieldType } from 'components/Form';
import { Variant as InputVariant, Size as InputSize } from 'components/Input';
import { useForm } from 'react-hook-form';
import useModal from 'hooks/useModal';
import AddApp from './components/AddApp';
import AppGrid from './components/AppGrid';
import { uniqueId } from 'lodash';
interface IAppsProps {}

interface IAppSearchForm {
  search?: string;
}

enum AppGroup {
  MY_APPS = 'My apps',
  ALL_APPS = 'All apps',
  FEATURED = 'Featured',
  COMMUNICATION = 'Communication',
  CUSTOMER_SUPPORT = 'Customer support',
  RESOURCES = 'Resources',
}

const Apps: React.FC<IAppsProps> = () => {
  // Form for searching apps
  const {
    control,
    watch,
    getValues,
    formState: { errors },
  } = useForm<IAppSearchForm>({
    mode: 'onChange',
  });

  // State to store app group
  const [selectedAppGroup, setSelectedAppGroup] = useState<AppGroup>(
    AppGroup.MY_APPS,
  );

  // Add app modal
  const [open, openModal, closeModal] = useModal(false, false);

  const selectedButtonClassName = '!bg-primary-50 text-primary-500';
  const regularButtonClassName = '!text-neutral-500';

  const apps = [
    {
      id: uniqueId(),
      url: 'https://instagram.com',
      label: 'Instagram',
      description:
        'Ruin your happiness in one easy click Ruin your happiness in one easy click Ruin your happiness in one easy click Ruin your happiness in one easy click Ruin your happiness in one easy click',
      category: 'Social Media',
      icon: {
        id: uniqueId(),
        original: 'https://i.imgur.com/Na1oyZM.png',
        thumbnail: 'https://i.imgur.com/Na1oyZM.png',
        small: 'https://i.imgur.com/Na1oyZM.png',
        medium: 'https://i.imgur.com/Na1oyZM.png',
        large: 'https://i.imgur.com/Na1oyZM.png',
        blurHash: 'LGG7;*n$3Gaet,aebdfk0=az_1j[',
      },
      credentials: {
        acsUrl: 'ACS URL',
        entityId: uniqueId(),
        relayState: 'RELAY STATE',
      },
    },
    {
      id: uniqueId(),
      url: 'https://facebook.com',
      label: 'Facebook',
      description: 'Ruin your peace of mind in one easy click',
      category: 'Social Media',
      icon: {
        id: uniqueId(),
        original: 'https://i.imgur.com/Na1oyZM.png',
        thumbnail: 'https://i.imgur.com/Na1oyZM.png',
        small: 'https://i.imgur.com/Na1oyZM.png',
        medium: 'https://i.imgur.com/Na1oyZM.png',
        large: 'https://i.imgur.com/Na1oyZM.png',
        blurHash: 'LGG7;*n$3Gaet,aebdfk0=az_1j[',
      },
      credentials: {
        acsUrl: 'ACS URL',
        entityId: uniqueId(),
        relayState: 'RELAY STATE',
      },
    },
  ];

  return (
    <div>
      <Card className="p-8">
        <div className="flex justify-between">
          <p className="font-bold text-2xl text-black">App Launcher</p>
          <Button onClick={openModal} label="+ Add apps" />
        </div>
        {/* Banner */}
        <img src={AppsBanner} className="w-full py-6" />
        {/* App groups and sort/filter/search */}
        <div className="flex justify-between pb-6">
          <div className="flex items-center gap-x-4">
            <Button
              variant={ButtonVariant.Secondary}
              label={AppGroup.MY_APPS}
              className={
                selectedAppGroup === AppGroup.MY_APPS
                  ? selectedButtonClassName
                  : regularButtonClassName
              }
              onClick={() => setSelectedAppGroup(AppGroup.MY_APPS)}
            />
            <Button
              variant={ButtonVariant.Secondary}
              label={AppGroup.ALL_APPS}
              className={
                selectedAppGroup === AppGroup.ALL_APPS
                  ? selectedButtonClassName
                  : regularButtonClassName
              }
              onClick={() => setSelectedAppGroup(AppGroup.ALL_APPS)}
            />
            <Button
              variant={ButtonVariant.Secondary}
              label={AppGroup.FEATURED}
              className={
                selectedAppGroup === AppGroup.FEATURED
                  ? selectedButtonClassName
                  : regularButtonClassName
              }
              onClick={() => setSelectedAppGroup(AppGroup.FEATURED)}
            />
            <Button
              variant={ButtonVariant.Secondary}
              label={AppGroup.COMMUNICATION}
              className={
                selectedAppGroup === AppGroup.COMMUNICATION
                  ? selectedButtonClassName
                  : regularButtonClassName
              }
              onClick={() => setSelectedAppGroup(AppGroup.COMMUNICATION)}
            />
            <Button
              variant={ButtonVariant.Secondary}
              label={AppGroup.CUSTOMER_SUPPORT}
              className={
                selectedAppGroup === AppGroup.CUSTOMER_SUPPORT
                  ? selectedButtonClassName
                  : regularButtonClassName
              }
              onClick={() => setSelectedAppGroup(AppGroup.CUSTOMER_SUPPORT)}
            />
            <Button
              variant={ButtonVariant.Secondary}
              label={AppGroup.RESOURCES}
              className={
                selectedAppGroup === AppGroup.RESOURCES
                  ? selectedButtonClassName
                  : regularButtonClassName
              }
              onClick={() => setSelectedAppGroup(AppGroup.RESOURCES)}
            />
          </div>
          <div className="flex gap-x-2 items-center">
            <IconButton
              icon="filterLinear"
              variant={IconVariant.Secondary}
              size={IconSize.Medium}
              borderAround
              className="bg-white"
            />
            <IconButton
              icon="arrowSwap"
              variant={IconVariant.Secondary}
              size={IconSize.Medium}
              borderAround
              className="bg-white"
            />
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
                  placeholder: 'Search members',
                  error: errors.search?.message,
                  dataTestId: 'people-search-members',
                  isClearable: true,
                },
              ]}
            />
          </div>
        </div>
        <p className="text-neutral-500">Showing {apps.length} results</p>
        <div className="pt-6">
          <AppGrid apps={apps} />
        </div>
      </Card>
      <AddApp open={open} closeModal={closeModal} />
    </div>
  );
};

export default Apps;
