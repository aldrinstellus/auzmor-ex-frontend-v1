import Layout, { FieldType } from 'components/Form';
import { FC, useEffect, useState } from 'react';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { IFilterForm } from '.';
import { enumToTitleCase } from 'utils/misc';
import { IRadioListOption } from 'components/RadioGroup';
import moment from 'moment';
import { DatePicker } from 'antd';
import Icon from 'components/Icon';
import Button, { Variant } from 'components/Button';
import './index.css';
import { parseNumber } from 'react-advanced-cropper';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface IChannelTypeProps {
  control: Control<IFilterForm, any>;
  watch: UseFormWatch<IFilterForm>;
  setValue: UseFormSetValue<IFilterForm>;
}

const DocumentModifed: FC<IChannelTypeProps> = ({
  control,
  watch,
  setValue,
}) => {
  const documentModifiedRadio = watch('documentModifiedRadio');
  const [customRange, setCustomRange] = useState<{
    min: number;
    max: number;
  } | null>(
    documentModifiedRadio &&
      documentModifiedRadio.toLowerCase().includes('custom')
      ? {
          min: parseNumber(documentModifiedRadio.split(':')[1].split('-')[0]),
          max: parseNumber(documentModifiedRadio.split(':')[1].split('-')[1]),
        }
      : null,
  );

  useEffect(() => {
    if (customRange) {
      setValue(
        'documentModifiedRadio',
        `custom:${customRange?.min}-${customRange?.max}`,
      );
    }
  }, [customRange]);

  const documentModifiedOptions: IRadioListOption[] = [
    {
      data: {
        id: 'today',
        value: 'Today',
        label: 'Today',
        metaValue: moment(new Date().setHours(0, 0, 0, 0)).toString(),
      },
      dataTestId: `document-modified-today`,
    },
    {
      data: {
        id: 'last7days',
        value: 'Last 7 days',
        label: 'Last 7 days',
        metaValue: moment().subtract(7, 'days').toString(),
      },
      dataTestId: `document-modified-last7days`,
    },
    {
      data: {
        id: 'last30days',
        value: 'Last 30 days',
        label: 'Last 30 days',
        metaValue: moment().subtract(30, 'days').toString(),
      },
      dataTestId: `document-modified-last30days`,
    },
    {
      data: {
        id: 'thisyear',
        value: `This year`,
        label: `This year (${new Date().getFullYear()})`,
        metaValue: moment(
          new Date().setFullYear(new Date().getFullYear(), 1, 1),
        ).toString(),
      },
      dataTestId: `document-modified-thisyear`,
    },
    {
      data: {
        id: 'lastyear',
        value: `Last year`,
        label: `Last year (${new Date().getFullYear() - 1})`,
        metaValue: moment(
          new Date().setFullYear(new Date().getFullYear() - 1, 1, 1),
        ).toString(),
      },
      dataTestId: `document-modified-lastyear`,
    },
    {
      data: {
        id: 'custom',
        value: `custom:${customRange?.min}-${customRange?.max}`,
        label: 'Custom',
      },
      dataTestId: `document-modified-custom`,
    },
  ];

  const documentModifiedFields = [
    {
      type: FieldType.Radio,
      name: 'documentModifiedRadio',
      control,
      radioList: documentModifiedOptions,
      labelRenderer: (option: IRadioListOption) => (
        <div className="flex gap-3 ml-2.5 cursor-pointer text-xs">
          {enumToTitleCase(option.data.label)}
          {option.data.id === 'custom' && (
            <div className="flex gap-1 items-center">
              <Icon name="calendar" size={14} />
              <RangePicker
                id="channel-doc-custom-filter"
                defaultValue={
                  customRange
                    ? [
                        dayjs(
                          moment(customRange?.max).format('YYYY-MM-DD'),
                          'YYYY-MM-DD',
                        ),
                        dayjs(
                          moment(customRange?.min).format('YYYY-MM-DD'),
                          'YYYY-MM-DD',
                        ),
                      ]
                    : undefined
                }
                onChange={(values) => {
                  if (values && values.length === 2) {
                    setCustomRange({
                      min: values[0]!.valueOf(),
                      max: values[1]!.valueOf(),
                    });
                  } else {
                    setCustomRange(null);
                  }
                }}
                renderExtraFooter={() => (
                  <div className="px-[18px] py-3">
                    <Button
                      label="Clear"
                      labelClassName="text-xs text-blue-500"
                      className="!p-0 border-none"
                      variant={Variant.Secondary}
                    />
                  </div>
                )}
                format={'DD MMM YYYY'}
                bordered={false}
                disabledDate={(current) =>
                  current && current > dayjs().endOf('day')
                }
              />
            </div>
          )}
        </div>
      ),
      rowClassName: 'px-6 py-3 border-b border-neutral-200',
    },
  ];

  return (
    <div className="px-2 py-4">
      <div className="max-h-[330px] min-h-[330px] overflow-y-auto">
        <Layout fields={documentModifiedFields} />
      </div>
    </div>
  );
};

export default DocumentModifed;
