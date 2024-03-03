import clsx from 'clsx';
import Avatar from 'components/Avatar';
import AvatarList from 'components/AvatarList';
import Button from 'components/Button';
import Card from 'components/Card';
import Icon from 'components/Icon';
import { useShouldRender } from 'hooks/useShouldRender';
import React, { FC, useMemo } from 'react';

interface IEventWidgetProps {
  className?: string;
  isLive?: boolean;
}
const ID = 'EventWidget';

const EventWidget: FC<IEventWidgetProps> = ({
  className = '',
  isLive = true,
}) => {
  const style = useMemo(
    () => clsx({ 'min-w-[240px] ': true, [className]: true }),
    [className],
  );
  const shouldRender = useShouldRender(ID);
  if (!shouldRender) {
    return <></>;
  }
  const chipTitle = isLive ? 'Live' : ' Starts in 2 Hrs 35 Min ';
  return (
    <div className={style}>
      <div className="flex justify-between items-center ">
        <div className="text-base font-bold">Events</div>
        <Button
          label={'View all'}
          className="bg-transparent !text-primary-500 hover:!text-primary-600 hover:!bg-transparent active:!bg-transparent active:!text-primary-700"
        />
      </div>
      <div className="mt-2">
        <Card className="w-full relative h-[400px] overflow-hidden group/card">
          <>
            <img
              src="https://s3-alpha-sig.figma.com/img/fbf5/cdae/4f089eacc729e60c460b4020eaeef640?Expires=1710115200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=py4Lf-tmZtbT6Dlj2Mi3FgIJ2ON9G1OAqnYhhuCXl2Phz1tDaNrVsdsOrBh5awBggEUgx0JZzS6x06X8d5SKFWMEBBIG78dEFpFF2B84VKW1MycImSpryqq1JkUbjbOovYfR3~~r2Vjl7TJtCCP6Tm8OylqrGw5WeJmUuMut0thmJAn5kz9FmV3X666rVMx54uTJ8bjN9U5ODcquHlfJyofyDUtYc7myDxYasTrpiyArt8kJRUvP5BxFHh~y-hUbTSE7qEwL3pxOcmNwWZ9NNJPX3H5Gd0dvQxdcHxmSgsIa20mEG-FN8qdZod74pEEWZKG3O75iHNTzO6jDOnul-w__"
              className="w-full  object-cover group-hover/card:scale-[1.10]"
              style={{
                transition: 'all 0.25s ease-in 0s',
                animation: '0.15s ease-in 0s 1 normal both running fadeIn',
              }}
            />
            {!isLive && (
              <>
                <div
                  className="cursor-pointer rounded-lg absolute"
                  style={{
                    color: 'rgba(0,0,0,.87)',
                    boxSizing: 'inherit',
                    background:
                      'linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%)',
                    inset: '0px',
                    zIndex: 2,
                  }}
                />
                <div className="absolute z-10 flex top-0 left-4 right-4 bottom-44 justify-center z-100 items-center inset-0">
                  <Button
                    label={'Join event'}
                    className="w-full bg-white text-white bg-opacity-20 border-white"
                  />
                </div>
              </>
            )}
            <div
              className={`absolute  ${
                isLive ? 'bg-primary-500' : 'bg-white border-neutral-200 '
              } z-10 gap-1 flex top-4 left-4 px-2.5 py-1 text-xs font-medium rounded  `}
            >
              <Icon
                name={isLive ? 'radar' : 'videoPlay'}
                size={18}
                color={isLive ? 'text-white' : 'text-primary-500'}
              />
              <p
                className={`text-xs ${
                  isLive ? 'text-white' : 'text-primary-500'
                } font-semibold`}
              >
                {chipTitle}
              </p>
            </div>

            <div className="absolute bg-white  bottom-0 left-0 flex flex-col p-4 z-10 gap-2 w-full">
              <div className="flex gap-1">
                {[...Array(2)].map((index) => {
                  return (
                    <div
                      key={index}
                      className="px-2 py-1 rounded bg-primary-100  text-center text-primary-500  text-xs font-medium"
                    >
                      Analytics
                    </div>
                  );
                })}
              </div>

              <div className="text-neutral-900 font-semibold text-base">
                Cancer Hope Network: The Machine Helps to Cure Disease
              </div>

              <div className="flex gap-2">
                <div className="flex gap-1 items-center">
                  <Icon name="calendar" size={16} color="text-primary-500" />
                  <p className="text-xs text-neutral-900">Feb 28, 2024</p>
                </div>
                <div className="flex gap-1 items-center">
                  <Icon name="clock" size={16} color="text-primary-500" />
                  <p className="text-xs text-neutral-900">5 h 53 m</p>
                </div>
              </div>
              <div className="flex items-center  gap-2">
                <Avatar
                  name={'Anshul'}
                  image={`https://avatars.githubusercontent.com/u/25411520?v=4`}
                  size={32}
                />

                <div className="text-neutral-500 text-xs font-normal">Name</div>

                <div className="flex ml-auto gap-1 items-center">
                  <Icon name="video" size={20} color="text-primary-500" />
                  <p className="text-xs text-neutral-500">Virtual</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AvatarList
                  size={32}
                  users={['asd', 'asdas', 'asdasd', 'asdasd']}
                  moreCount={20}
                  className="-space-x-[12px]"
                  avatarClassName="!b-[1px]"
                />

                <div className="text-xs  text-neutral-500 underline font-normal">
                  More attendees
                </div>
              </div>
              {isLive && <Button label={'Join event'} className="w-full " />}
            </div>
          </>
        </Card>
      </div>
    </div>
  );
};

export default EventWidget;
