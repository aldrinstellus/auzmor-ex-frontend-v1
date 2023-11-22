import Button, { Variant, Size } from 'components/Button';
import Card from 'components/Card';
import Collapse from 'components/Collapse';
import Divider from 'components/Divider';
import Layout, { FieldType } from 'components/Form';
import Icon from 'components/Icon';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import NoAnnouncement from 'images/NoAnnouncement.svg';

const BrandingSettings: FC = () => {
  const { control } = useForm();
  return (
    <>
      <Card className="p-6">
        <div className="flex justify-between w-full">
          <div className="flex flex-col gap-4">
            <p className="text-neutral-900 text-base font-bold">Branding</p>
            <p className="text-neutral-500 text-sm">
              Branding Options for a Personalized Experience
            </p>
          </div>
          <div className="flex flex-col">
            <div className="flex gap-2">
              <Button label="Cancel" variant={Variant.Secondary} />
              <Button label="Save changes" />
            </div>
            <div></div>
          </div>
        </div>
      </Card>
      <Collapse
        defaultOpen
        label="Page settings"
        className="rounded-9xl overflow-hidden"
        headerClassName="px-6 py-4 bg-white"
        headerTextClassName="text-base font-bold text-neutral-900"
        dataTestId="brandingsetting-pagesettings"
      >
        <div className="flex flex-col gap-4 bg-white px-6 pb-4">
          <Divider />
          <Layout
            fields={[
              {
                name: 'pageTitle',
                label: 'Page Title',
                type: FieldType.Input,
                control,
                className: '',
                dataTestId: 'page-title',
                defaultValue: 'Auzmor Office',
              },
            ]}
          />
          <div className="flex">
            <div className="flex flex-col w-1/2">
              <div>Logo</div>
            </div>
            <div className="flex flex-col w-1/2">
              <div>Favicon</div>
            </div>
          </div>
        </div>
      </Collapse>
      <Collapse
        defaultOpen
        label="Colour theme"
        className="rounded-9xl overflow-hidden"
        headerClassName="px-6 py-4 bg-white"
        headerTextClassName="text-base font-bold text-neutral-900"
        dataTestId="brandingsetting-colour-theme"
      >
        <div className="flex flex-col gap-4 bg-white px-6 pb-4">
          <Divider />
          <div className="flex justify-between w-full items-center">
            <div className="w-2/5 flex flex-col gap-4">
              <Layout
                fields={[
                  {
                    name: 'primaryColor',
                    label: 'Primary/action colour',
                    type: FieldType.Input,
                    control,
                    className: '',
                    dataTestId: 'page-title',
                    defaultValue: 'Auzmor Office',
                  },
                ]}
              />
              <div className="flex text-primary-500 group cursor-pointer group-hover:text-primary-700 text-base font-bold">
                <Icon name="add" color="text-primary-500" />
                <p>Add secondary colour</p>
              </div>
            </div>
            <div className="w-[182px] flex flex-col rounded-7xl overflow-hidden gap-1 border border-neutral-200 shadow-sm">
              <div className="p-3 flex bg-blue-700 gap-2 px-2.5">
                <Icon
                  name="flashIcon"
                  className="text-white"
                  hover={false}
                  size={16}
                />
                <p className="text-white font-bold text-xs">Secondary</p>
              </div>
              <p className="text-neutral-900 font-bold text-base text-center px-2.5">
                Lorem ipsum dolor
              </p>
              <p className="font-normal text-[8px] text-neutral-500 text-center px-2.5">
                Lorem ipsum dolor si amet. Lorem ipsum dolor si amet
              </p>
              <img src={NoAnnouncement} className="h-[70px]" />
              <Button label="Primary" className="mx-2.5" size={Size.Small} />
              <p className="font-normal text-[8px] text-neutral-500 text-center px-2.5 mb-4">
                Only admins can see this.
              </p>
            </div>
          </div>
        </div>
      </Collapse>
      <Collapse
        defaultOpen
        label="Login"
        className="rounded-9xl overflow-hidden"
        headerClassName="px-6 py-4 bg-white"
        headerTextClassName="text-base font-bold text-neutral-900"
        dataTestId="brandingsetting-login"
      >
        <div className="flex flex-col gap-4 bg-white px-6 pb-4">
          <Divider />
          <div className="flex justify-between w-full items-center">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <p className="text-sm font-bold text-neutral-900">
                  Layout alignment
                </p>
                <div className="flex gap-[60px]">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-[100px] h-[60px] bg-neutral-100 relative border border-neutral-200 rounded-7xl">
                      <div className="absolute top-0 left-0 h-full w-[40px] rounded-7xl bg-neutral-400"></div>
                    </div>
                    <p className="text-neutral-900 font-medium text-sm">Left</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-[100px] h-[60px] bg-neutral-100 flex justify-center border border-neutral-200 rounded-7xl">
                      <div className="h-full w-[40px] rounded-7xl bg-neutral-400"></div>
                    </div>
                    <p className="text-neutral-900 font-medium text-sm">
                      Center
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-[100px] h-[60px] bg-neutral-100 relative border border-neutral-200 rounded-7xl">
                      <div className="absolute top-0 right-0 h-full w-[40px] rounded-7xl bg-neutral-400"></div>
                    </div>
                    <p className="text-neutral-900 font-medium text-sm">
                      Right
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex"></div>
          </div>
        </div>
      </Collapse>
    </>
  );
};

export default BrandingSettings;
