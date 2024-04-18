import Button, { Variant as ButtonVariant } from 'components/Button';
import Divider from 'components/Divider';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import { IDepartmentAPI } from 'queries/department';
import { ILocationAPI } from 'queries/location';
import { FC, ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import Locations from './Locations';
import Departments from './Departments';
import Status from './Status';
import { ICheckboxListOption } from 'components/CheckboxList';
import Categories from './Categories';
import { ICategory } from 'queries/category';
import { ITeam } from 'queries/teams';
import Teams from './Teams';
import { CategoryType } from 'queries/apps';
import { UserStatus } from 'queries/users';
import { ChannelVisibilityEnum } from 'stores/channelStore';
import Visibility from './Visibility';
import ChannelType, { ChannelTypeEnum } from './ChannelType';
import { useTranslation } from 'react-i18next';
import { IDocType } from 'queries/storage';
import DocumentPeople from './DocumentPeople';
import DocumentType from './DocumentType';
import DocumentModified from './DocumentModifed';

export interface IFilterForm {
  visibilityRadio: ChannelVisibilityEnum;
  channelTypeRadio: ChannelTypeEnum;
  statusCheckbox: ICheckboxListOption[];
  locationCheckbox: ICheckboxListOption[];
  departmentCheckbox: ICheckboxListOption[];
  categoryCheckbox: ICheckboxListOption[];
  documentTypeCheckbox: any;
  documentPeopleCheckbox: any;
  documentModifiedCheckbox: any;
  teamCheckbox: ICheckboxListOption[];
  locationSearch: string;
  departmentSearch: string;
  categorySearch: string;
  teamSearch: string;
  statusSearch: string;
  docUserSearch: string;
}

export interface IStatus {
  id: UserStatus;
  name: string;
}

export enum FilterModalVariant {
  Orgchart = 'ORGCHART',
  People = 'PEOPLE',
  Team = 'TEAM',
  App = 'APP',
  ChannelsListing = 'CHANNELS_LISTING',
  Document = 'DOCUMENT',
}

export interface IAppliedFilters {
  locations?: ILocationAPI[];
  departments?: IDepartmentAPI[];
  status?: IStatus[];
  categories?: ICategory[];
  teams?: ITeam[];
  visibility?: ChannelVisibilityEnum;
  channelType?: ChannelTypeEnum;
  docTypeCheckbox?: IDocType[];
  docPeopleCheckbox?: any;
  docModifiedCheckbox?: any;
}

interface IFilterModalProps {
  open: boolean;
  closeModal: () => void;
  appliedFilters: IAppliedFilters;
  onApply: (appliedFilters: IAppliedFilters) => void;
  onClear: () => void;
  variant?: FilterModalVariant;
}

interface IFilters {
  key: string;
  isHidden: boolean;
  label: () => ReactNode;
  component: () => ReactNode;
}

const FilterModal: FC<IFilterModalProps> = ({
  open,
  closeModal,
  appliedFilters = {
    locations: [],
    departments: [],
    categories: [],
    status: [],
    teams: [],
    channelType: ChannelTypeEnum.MyChannels,
    visibility: ChannelVisibilityEnum.All,
    docTypeCheckbox: [],
    docPeopleCheckbox: [],
    docModifiedCheckbox: [],
  },
  onApply,
  onClear,
  variant = FilterModalVariant.People,
}) => {
  const { t } = useTranslation('filterModal');
  const { control, handleSubmit, watch, setValue } = useForm<IFilterForm>({
    mode: 'onChange',
    defaultValues: {
      channelTypeRadio:
        appliedFilters.channelType || ChannelTypeEnum.MyChannels,
      visibilityRadio: appliedFilters.visibility || ChannelVisibilityEnum.All,
      statusCheckbox: (appliedFilters.status || []).map((status) => ({
        data: status,
        dataTestId: `status-${status.name}`,
      })),
      locationCheckbox: (appliedFilters.locations || []).map((location) => ({
        data: location,
        dataTestId: `location-${location.name}`,
      })),
      departmentCheckbox: (appliedFilters.departments || []).map(
        (department) => ({
          data: department,
          dataTestId: `department-${department.name}`,
        }),
      ),
      categoryCheckbox: (appliedFilters.categories || []).map((category) => ({
        data: category,
        dataTestId: `category-${category.name}`,
      })),
      teamCheckbox: (appliedFilters.teams || []).map((team) => ({
        data: team,
        dataTestId: `team-${team.name}`,
      })),
      documentTypeCheckbox: (appliedFilters.docTypeCheckbox || [])?.map(
        (docs: any) => ({
          data: docs,
          dataTestId: `doc-${docs.name}`,
        }),
      ),
      documentPeopleCheckbox: (appliedFilters.docPeopleCheckbox || [])?.map(
        (docs: any) => ({
          data: docs,
          dataTestId: `doc-${docs.name}`,
        }),
      ),
      documentModifiedCheckbox: (appliedFilters.docModifiedCheckbox || [])?.map(
        (docs: any) => ({
          data: docs,
          dataTestId: `doc-${docs.name}`,
        }),
      ),
    },
  });

  const [
    locationCheckbox,
    departmentCheckbox,
    categoryCheckbox,
    teamCheckbox,
    statusCheckbox,
    documentTypeCheckbox,
    documentPeopleCheckbox,
    documentModifiedCheckbox,
  ] = watch([
    'locationCheckbox',
    'departmentCheckbox',
    'categoryCheckbox',
    'teamCheckbox',
    'statusCheckbox',
    'documentTypeCheckbox',
    'documentPeopleCheckbox',
    'documentModifiedCheckbox',
  ]);

  const onSubmit = (formData: IFilterForm) => {
    onApply({
      locations: formData.locationCheckbox.map(
        (location) => location.data,
      ) as ILocationAPI[],
      departments: formData.departmentCheckbox.map(
        (department) => department.data,
      ) as IDepartmentAPI[],
      categories: formData.categoryCheckbox.map(
        (category) => category.data,
      ) as ICategory[],
      teams: formData.teamCheckbox.map((team) => team.data) as ITeam[],
      status: formData.statusCheckbox.map(
        (category) => category.data,
      ) as IStatus[],
      docTypeCheckbox: formData.documentTypeCheckbox.map(
        (docType: any) => docType.data,
      ),
      docPeopleCheckbox: formData.documentPeopleCheckbox.map(
        (docType: any) => docType.data,
      ),
      docModifiedCheckbox: formData.documentModifiedCheckbox.map(
        (docType: any) => docType.data,
      ),
      visibility: formData.visibilityRadio,
      channelType: formData.channelTypeRadio,
    } as unknown as IAppliedFilters);
  };

  const filterNavigation = [
    {
      label: () => (
        <div className="flex items-center">
          <div>People</div>
          {!!documentPeopleCheckbox.length && (
            <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center ml-1 text-xxs font-bold">
              {documentPeopleCheckbox.length}
            </div>
          )}
        </div>
      ),
      key: 'doc-people-filters',
      component: () => (
        <DocumentPeople control={control} watch={watch} setValue={setValue} />
      ),
      isHidden: [
        FilterModalVariant.Team,
        FilterModalVariant.App,
        FilterModalVariant.Orgchart,
        FilterModalVariant.People,
        FilterModalVariant.ChannelsListing,
      ].includes(variant),
      dataTestId: 'filterby-doc-people',
    },
    {
      label: () => (
        <div className="flex items-center">
          <div>Type</div>
          {!!documentTypeCheckbox.length && (
            <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center ml-1 text-xxs font-bold">
              {documentTypeCheckbox.length}
            </div>
          )}
        </div>
      ),
      key: 'doc-type-filters',
      component: () => (
        <DocumentType control={control} watch={watch} setValue={setValue} />
      ),
      isHidden: [
        FilterModalVariant.Team,
        FilterModalVariant.App,
        FilterModalVariant.Orgchart,
        FilterModalVariant.People,
        FilterModalVariant.ChannelsListing,
      ].includes(variant),
      dataTestId: 'filterby-doc-people',
    },
    {
      label: () => (
        <div className="flex items-center">
          <div>Modified on</div>
          {!!documentModifiedCheckbox.length && (
            <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center ml-1 text-xxs font-bold">
              {documentModifiedCheckbox.length}
            </div>
          )}
        </div>
      ),
      key: 'doc-modified-filters',
      component: () => (
        <DocumentModified control={control} watch={watch} setValue={setValue} />
      ),
      isHidden: [
        FilterModalVariant.Team,
        FilterModalVariant.App,
        FilterModalVariant.Orgchart,
        FilterModalVariant.People,
        FilterModalVariant.ChannelsListing,
      ].includes(variant),
      dataTestId: 'filterby-doc-people',
    },
    {
      label: () => (
        <div className="flex items-center">
          <div>{t('visibility')}</div>
        </div>
      ),
      key: 'visibility-filters',
      component: () => (
        <Visibility control={control} watch={watch} setValue={setValue} />
      ),
      isHidden: [
        FilterModalVariant.Team,
        FilterModalVariant.App,
        FilterModalVariant.Orgchart,
        FilterModalVariant.People,
        FilterModalVariant.Document,
      ].includes(variant),
      dataTestId: 'filterby-visibility',
    },
    {
      label: () => (
        <div className="flex items-center">
          <div>{t('type')}</div>
        </div>
      ),
      key: 'channel-type-filters',
      component: () => (
        <ChannelType control={control} watch={watch} setValue={setValue} />
      ),
      isHidden: [
        FilterModalVariant.Team,
        FilterModalVariant.App,
        FilterModalVariant.Orgchart,
        FilterModalVariant.People,
        FilterModalVariant.Document,
      ].includes(variant),
      dataTestId: 'filterby-channel-type',
    },
    {
      label: () => (
        <div className="flex items-center">
          <div>{t('location')}</div>
          {!!locationCheckbox.length && (
            <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center ml-1 text-xxs font-bold">
              {locationCheckbox.length}
            </div>
          )}
        </div>
      ),
      key: 'locations-filters',
      component: () => (
        <Locations control={control} watch={watch} setValue={setValue} />
      ),
      isHidden: [
        FilterModalVariant.Team,
        FilterModalVariant.App,
        FilterModalVariant.ChannelsListing,
        FilterModalVariant.Document,
      ].includes(variant),
      dataTestId: 'filterby-location',
    },
    {
      label: () => (
        <div className="flex items-center">
          <div>{t('department')}</div>
          {!!departmentCheckbox.length && (
            <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center ml-1 text-xxs font-bold">
              {departmentCheckbox.length}
            </div>
          )}
        </div>
      ),
      key: 'departments-filters',
      component: () => (
        <Departments control={control} watch={watch} setValue={setValue} />
      ),
      isHidden: [
        FilterModalVariant.Team,
        FilterModalVariant.App,
        FilterModalVariant.ChannelsListing,
        FilterModalVariant.Document,
      ].includes(variant),
      dataTestId: 'filterby-department',
    },
    {
      label: () => (
        <div className="flex items-center">
          <div>{t('category')}</div>
          {!!categoryCheckbox.length && (
            <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center ml-1 text-xxs font-bold">
              {categoryCheckbox.length}
            </div>
          )}
        </div>
      ),
      key: 'categories-filters',
      component: () => (
        <Categories
          control={control}
          watch={watch}
          setValue={setValue}
          type={
            variant === FilterModalVariant.App
              ? CategoryType.APP
              : CategoryType.TEAM
          }
        />
      ),
      isHidden: [
        FilterModalVariant.Orgchart,
        FilterModalVariant.People,
        FilterModalVariant.Document,
      ].includes(variant),
      dataTestId: 'filterby-categories',
    },
    {
      label: () => (
        <div className="flex items-center">
          <div>{t('team')}</div>
          {!!teamCheckbox.length && (
            <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center ml-1 text-xxs font-bold">
              {teamCheckbox.length}
            </div>
          )}
        </div>
      ),
      key: 'team-filters',
      component: () => (
        <Teams control={control} watch={watch} setValue={setValue} />
      ),
      isHidden: [
        FilterModalVariant.People,
        FilterModalVariant.Orgchart,
        FilterModalVariant.Team,
        FilterModalVariant.ChannelsListing,
        FilterModalVariant.Document,
      ].includes(variant),
      dataTestId: 'filterby-teams',
    },
    {
      label: () => (
        <div className="flex items-center">
          <div>{t('status')}</div>
          {!!statusCheckbox.length && (
            <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center ml-1 text-xxs font-bold">
              {statusCheckbox.length}
            </div>
          )}
        </div>
      ),
      key: 'status-filters',
      component: () => (
        <Status control={control} watch={watch} setValue={setValue} />
      ),
      isHidden: [
        FilterModalVariant.Team,
        FilterModalVariant.App,
        FilterModalVariant.ChannelsListing,
        FilterModalVariant.Document,
      ].includes(variant),
      dataTestId: 'filterby-status',
    },
  ].filter((filter) => !filter.isHidden);
  const [activeFilter, setActiveFilter] = useState<IFilters>(
    filterNavigation[0],
  );
  return (
    <Modal open={open} closeModal={closeModal} className="max-w-[665px]">
      <Header
        title={t('title')}
        onClose={() => closeModal()}
        closeBtnDataTestId="close-filters"
      />

      <form>
        <div className="flex w-full">
          <div className="flex flex-col w-1/3 pb-64 border-r-2 border-r-neutral-200">
            <div className="border-b-2 border-b-bg-neutral-200">
              {filterNavigation.map((item, index) => (
                <div
                  key={item.key}
                  onClick={() => setActiveFilter(item)}
                  data-testid={item?.dataTestId}
                >
                  <div
                    className={`text-sm font-medium p-4 hover:cursor-pointer ${
                      item.key === activeFilter.key &&
                      'text-primary-500 bg-primary-50 hover:cursor-default'
                    }`}
                  >
                    {item.label()}
                  </div>
                  {index !== filterNavigation.length - 1 && <Divider />}
                </div>
              ))}
            </div>
          </div>
          <div className="w-2/3">{activeFilter.component()}</div>
        </div>
      </form>

      {/* Footer */}
      <div className="flex justify-end items-center h-16 p-6 bg-blue-50 rounded-b-9xl">
        <Button
          label={t('clearFilterCTA')}
          variant={ButtonVariant.Secondary}
          onClick={onClear}
          className="mr-4"
          dataTestId="clear-filters"
        />
        <Button
          label={t('applyFilterCTA')}
          variant={ButtonVariant.Primary}
          onClick={handleSubmit(onSubmit)}
          dataTestId="apply-filter"
        />
      </div>
    </Modal>
  );
};

export default FilterModal;
