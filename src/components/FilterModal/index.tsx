import Button, { Variant as ButtonVariant } from 'components/Button';
import Divider from 'components/Divider';
import Modal from 'components/Modal';
import Header from 'components/ModalHeader';
import {
  ICategory,
  IDepartmentAPI,
  IDocType,
  ILocationAPI,
  ITeam,
  UserStatus,
  CategoryType,
  UserRole,
} from 'interfaces';
import { FC, ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import Locations from './Locations';
import Departments from './Departments';
import Status from './Status';
import { ICheckboxListOption } from 'components/CheckboxList';
import Categories from './Categories';
import Teams from './Teams';
import {
  CHANNEL_MEMBER_STATUS,
  ChannelVisibilityEnum,
} from 'stores/channelStore';
import Visibility from './Visibility';
import ChannelType, { ChannelTypeEnum } from './ChannelType';
import { useTranslation } from 'react-i18next';
import DocumentPeople from './DocumentPeople';
import DocumentType from './DocumentType';
import DocumentModified from './DocumentModifed';
import Roles from './Roles';
import ByPeople, { ByPeopleEnum } from './ByPeople';
import ChannelRequestStatus from './ChannelRequestStatus';
import { titleCase } from 'utils/misc';
import Channels from './Channels';
import useRole from 'hooks/useRole';

export interface IFilterForm {
  visibilityRadio: ChannelVisibilityEnum;
  channelTypeRadio: ChannelTypeEnum;
  statusCheckbox: ICheckboxListOption[];
  channelRequestStatusCheckbox: ICheckboxListOption[];
  locationCheckbox: ICheckboxListOption[];
  departmentCheckbox: ICheckboxListOption[];
  channelCheckbox: ICheckboxListOption[];
  categoryCheckbox: ICheckboxListOption[];
  documentTypeCheckbox: any;
  documentPeopleCheckbox: any;
  documentModifiedRadio: any;
  teamCheckbox: ICheckboxListOption[];
  roleCheckbox: ICheckboxListOption[];
  byPeopleCheckbox: ICheckboxListOption[];
  locationSearch: string;
  channelSearch: string;
  departmentSearch: string;
  categorySearch: string;
  teamSearch: string;
  statusSearch: string;
  roleSearch: string;
  byPeopleSearch: string;
  docUserSearch: string;
  visibilitySearch: string;
  channelTypeSearch: string;
  channelRequestStatusSearch: string;
}

export interface IChannelFilter {
  id: string;
  name: string;
}
export interface IStatus {
  id: UserStatus;
  name: string;
}

export interface IChannelRequestStatus {
  id: CHANNEL_MEMBER_STATUS;
  name: string;
}
export interface IRole {
  id: UserRole;
  name: string;
}
export interface IBypeople {
  id: ByPeopleEnum;
  name: string;
}

export enum FilterModalVariant {
  Orgchart = 'ORGCHART',
  People = 'PEOPLE',
  Team = 'TEAM',
  App = 'APP',
  ChannelsListing = 'CHANNELS_LISTING',
  Document = 'DOCUMENT',
  ChannelsMangeAcess = 'CHANNELS_MANAGE_ACCESS',
  ChannelMember = 'CHANNEL_MEMBER',
  ChannelRequest = 'CHANNEL_REQUEST',
  LxpApp = 'LXP_APP',
}

export interface IAppliedFilters {
  locations?: ILocationAPI[];
  departments?: IDepartmentAPI[];
  status?: IStatus[];
  channelRequestStatus?: IChannelRequestStatus[];
  roles?: IRole[];
  categories?: ICategory[];
  teams?: ITeam[];
  visibility?: ChannelVisibilityEnum;
  channelType?: ChannelTypeEnum;
  docTypeCheckbox?: IDocType[];
  docPeopleCheckbox?: any;
  docModifiedRadio?: any;
  byPeople?: IBypeople[];
  channels?: IChannelFilter[];
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
    docModifiedRadio: [],
    roles: [],
    byPeople: [],
    channelRequestStatus: [],
    channels: [],
  },
  onApply,
  onClear,
  variant = FilterModalVariant.People,
}) => {
  const { t } = useTranslation('filterModal');
  const { isLearner } = useRole();

  const defaultChannelRequestStatus = !!(
    appliedFilters?.channelRequestStatus || []
  ).length
    ? (appliedFilters.channelRequestStatus || [])?.map(
        (channelRequestStatus: any) => ({
          data: channelRequestStatus,
          dataTestId: `channel-request-status-${channelRequestStatus.name}`,
        }),
      )
    : variant === FilterModalVariant.ChannelRequest
    ? [
        {
          data: {
            id: CHANNEL_MEMBER_STATUS.PENDING,
            name: titleCase(CHANNEL_MEMBER_STATUS.PENDING),
          },
          dataTestId: `channel-request-status-${CHANNEL_MEMBER_STATUS.PENDING}`,
        },
      ]
    : [];

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
      roleCheckbox: (appliedFilters.roles || []).map((role) => ({
        data: role,
        dataTestId: `role-${role.name}`,
      })),
      byPeopleCheckbox: (appliedFilters.byPeople || []).map((people: any) => ({
        data: people,
        dataTestId: `byPeople-${people.name}`,
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
      channelCheckbox: (appliedFilters.channels || []).map((channel) => ({
        data: channel,
        dataTestId: `channel-${channel.name}`,
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
      documentModifiedRadio: appliedFilters.docModifiedRadio || [],
      channelRequestStatusCheckbox: defaultChannelRequestStatus,
    },
  });

  const [
    locationCheckbox,
    departmentCheckbox,
    categoryCheckbox,
    channelCheckbox,
    teamCheckbox,
    statusCheckbox,
    roleCheckbox,
    documentTypeCheckbox,
    documentPeopleCheckbox,
    byPeopleCheckbox,
    channelRequestStatusCheckbox,
  ] = watch([
    'locationCheckbox',
    'departmentCheckbox',
    'categoryCheckbox',
    'channelCheckbox',
    'teamCheckbox',
    'statusCheckbox',
    'roleCheckbox',
    'documentTypeCheckbox',
    'documentPeopleCheckbox',
    'byPeopleCheckbox',
    'channelRequestStatusCheckbox',
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
      channels: formData.channelCheckbox.map(
        (category) => category.data,
      ) as IChannelFilter[],
      teams: formData.teamCheckbox.map((team) => team.data) as ITeam[],
      status: formData.statusCheckbox.map(
        (category) => category.data,
      ) as IStatus[],
      roles: formData.roleCheckbox.map((role) => role.data) as IRole[],
      docTypeCheckbox: formData.documentTypeCheckbox.map(
        (docType: any) => docType.data,
      ),
      docPeopleCheckbox: formData.documentPeopleCheckbox.map(
        (docType: any) => docType.data,
      ),
      docModifiedRadio: formData.documentModifiedRadio,
      visibility: formData.visibilityRadio,
      channelType: formData.channelTypeRadio,
      byPeople: formData.byPeopleCheckbox.map(
        (people) => people.data,
      ) as IBypeople[],
      channelRequestStatus: formData.channelRequestStatusCheckbox.map(
        (status) => status.data,
      ) as IChannelRequestStatus[],
    } as unknown as IAppliedFilters);
  };

  const filterOptionMappings = {
    'doc-people-filters': [FilterModalVariant.Document],
    'doc-type-filters': [FilterModalVariant.Document],
    'doc-modified-filters': [FilterModalVariant.Document],
    'visibility-filters': [FilterModalVariant.ChannelsListing],
    'channel-type-filters': [FilterModalVariant.ChannelsListing],
    'channel-roles-filters': [FilterModalVariant.ChannelMember],
    'locations-filters': [
      FilterModalVariant.Orgchart,
      FilterModalVariant.People,
    ],
    'departments-filters': [
      FilterModalVariant.Orgchart,
      FilterModalVariant.People,
    ],
    'categories-filters': [
      FilterModalVariant.Team,
      FilterModalVariant.App,
      FilterModalVariant.LxpApp,
      FilterModalVariant.ChannelsListing,
    ],
    'channel-filters': [],
    'team-filters': [
      FilterModalVariant.App,
      FilterModalVariant.ChannelMember,
      FilterModalVariant.ChannelRequest,
      FilterModalVariant.ChannelsMangeAcess,
      ...(isLearner ? [] : [FilterModalVariant.LxpApp]),
    ],
    'status-filters': [
      FilterModalVariant.People,
      FilterModalVariant.Orgchart,
      FilterModalVariant.ChannelMember,
      FilterModalVariant.ChannelsMangeAcess,
    ],
    'by-people-filter': [
      FilterModalVariant.ChannelMember,
      FilterModalVariant.ChannelRequest,
      FilterModalVariant.ChannelsMangeAcess,
    ],
    'channel-request-status': [],
  };

  const filterNavigation = [
    {
      label: () => (
        <div className="flex items-center">
          <div>{t('people')}</div>
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
      isHidden: !filterOptionMappings['doc-people-filters'].includes(variant),
      dataTestId: 'filterby-doc-people',
    },
    {
      label: () => (
        <div className="flex items-center">
          <div>{t('type')}</div>
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
      isHidden: !filterOptionMappings['doc-type-filters'].includes(variant),
      dataTestId: 'filterby-doc-type',
    },
    {
      label: () => (
        <div className="flex items-center">
          <div>{t('modified')}</div>
        </div>
      ),
      key: 'doc-modified-filters',
      component: () => (
        <DocumentModified control={control} watch={watch} setValue={setValue} />
      ),
      isHidden: !filterOptionMappings['doc-modified-filters'].includes(variant),
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
      isHidden: !filterOptionMappings['visibility-filters'].includes(variant),
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
      isHidden: !filterOptionMappings['channel-type-filters'].includes(variant),
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
      isHidden: !filterOptionMappings['locations-filters'].includes(variant),
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
      isHidden: !filterOptionMappings['departments-filters'].includes(variant),
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
      isHidden: !filterOptionMappings['categories-filters'].includes(variant),
      dataTestId: 'filterby-categories',
    },
    {
      label: () => (
        <div className="flex items-center">
          <div>{t('channel')}</div>
          {!!channelCheckbox.length && (
            <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center ml-1 text-xxs font-bold">
              {channelCheckbox.length}
            </div>
          )}
        </div>
      ),
      key: 'channel-filters',
      component: () => (
        <Channels control={control} watch={watch} setValue={setValue} />
      ),
      isHidden: true,
      dataTestId: 'filterby-channel-filters',
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
      isHidden: !filterOptionMappings['team-filters'].includes(variant),
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
      isHidden: !filterOptionMappings['status-filters'].includes(variant),
      dataTestId: 'filterby-status',
    },
    {
      label: () => (
        <div className="flex items-center">
          <div>{t('status')}</div>
          {!!channelRequestStatusCheckbox.length && (
            <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center ml-1 text-xxs font-bold">
              {channelRequestStatusCheckbox.length}
            </div>
          )}
        </div>
      ),
      key: 'channel-request-status-filters',
      component: () => (
        <ChannelRequestStatus
          control={control}
          watch={watch}
          setValue={setValue}
        />
      ),
      isHidden: true,
      dataTestId: 'filterby-channel-request-status',
    },
    {
      label: () => (
        <div className="flex items-center">
          <div>{t('role')} </div>
          {!!roleCheckbox.length && (
            <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center ml-1 text-xxs font-bold">
              {roleCheckbox.length}
            </div>
          )}
        </div>
      ),
      key: 'roles-filters',
      component: () => (
        <Roles control={control} watch={watch} setValue={setValue} />
      ),
      isHidden:
        !filterOptionMappings['channel-roles-filters'].includes(variant),
      dataTestId: 'filterby-roles',
    },
    {
      label: () => (
        <div className="flex items-center">
          <div>{t('byPeople')}</div>
          {!!byPeopleCheckbox.length && (
            <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center ml-1 text-xxs font-bold">
              {byPeopleCheckbox.length}
            </div>
          )}
        </div>
      ),
      key: 'by-people-filter',
      component: () => (
        <ByPeople control={control} watch={watch} setValue={setValue} />
      ),
      isHidden: !filterOptionMappings['by-people-filter'].includes(variant),
      dataTestId: 'filterby-Bypeople',
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
            <ul className="border-b-2 border-b-bg-neutral-200">
              {filterNavigation.map((item, index) => (
                <li
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
                </li>
              ))}
            </ul>
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
