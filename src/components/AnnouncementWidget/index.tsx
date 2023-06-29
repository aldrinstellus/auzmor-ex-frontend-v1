import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Card from 'components/Card';
import { announcementRead, useAnnouncementsWidget } from 'queries/post';
import Button, { Variant } from 'components/Button';
import useAuth from 'hooks/useAuth';
import Avatar from 'components/Avatar';
import Icon from 'components/Icon';
import { humanizeTime } from 'utils/time';
import SkeletonLoader from './components/SkeletonLoader';
import RenderQuillContent from 'components/RenderQuillContent';

export interface IAnnouncementCardProps {}

const AnnouncementCard: React.FC<IAnnouncementCardProps> = () => {
  const queryClient = useQueryClient();

  const acknowledgeAnnouncement = useMutation({
    mutationKey: ['acknowledge-announcement'],
    mutationFn: announcementRead,
    onError: (error) => console.log(error),
    onSuccess: async (data, variables, context) => {
      await queryClient.invalidateQueries(['announcements-widget']);
      await queryClient.invalidateQueries(['feed']);
    },
  });

  const { data, isLoading } = useAnnouncementsWidget();

  const { user } = useAuth();

  const itemCount = data?.data?.result?.data.length;
  const isAcknowledged =
    data?.data?.result?.data?.[0]?.myAcknowledgement?.reaction !== 'mark_read';

  return (
    <div className="min-w-[240px] sticky top-24">
      <div className="flex justify-between items-center ">
        <div className="text-base font-bold">Announcements</div>
        {/* <div className="text-sm font-bold">View All</div> */}
      </div>
      <div className="mt-2">
        <Card className="pb-6 flex flex-col rounded-9xl">
          <div className="rounded-t-9xl bg-blue-700 text-white py-3 w-full flex justify-start space-x-1 px-3">
            <Icon name="flashIcon" />
            <div className="text-base font-bold">Announcement</div>
          </div>
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <div className="w-full px-6">
              {itemCount && isAcknowledged ? (
                <div className="flex flex-col items-start">
                  <div className="mt-4">
                    <div className="flex space-x-3">
                      <div>
                        <Avatar
                          name={
                            data?.data?.result?.data?.[0]?.createdBy
                              ?.fullName || 'U'
                          }
                          image={
                            data?.data?.result?.data?.[0]?.createdBy
                              ?.profileImage?.original
                          }
                          size={40}
                        />
                      </div>
                      <div>
                        <div className="space-x-1 text-sm">
                          <span className="text-neutral-900 font-bold">
                            {data?.data?.result?.data?.[0]?.createdBy?.fullName}
                          </span>
                          <span className="text-neutral-900 font-normal">
                            shared a post
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {humanizeTime(
                            data?.data?.result?.data?.[0]?.createdAt,
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 flex ">
                      <RenderQuillContent data={data?.data?.result?.data[0]} />
                    </div>
                  </div>
                  <div className="w-full flex justify-center">
                    <Button
                      label="Mark as read"
                      variant={Variant.Secondary}
                      className="border-2 border-neutral-200 mt-4 w-full"
                      loading={acknowledgeAnnouncement.isLoading}
                      onClick={() => {
                        acknowledgeAnnouncement.mutate({
                          entityId: data?.data?.result?.data[0].id,
                          entityType: 'post',
                          type: 'acknowledge',
                          reaction: 'mark_read',
                        });
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center p-6">
                  No pending announcements
                </div>
                // replace with empty widget
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AnnouncementCard;
