import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Card from 'components/Card';
import { announcementRead, useAnnouncementsWidget } from 'queries/post';
import Button, { Variant } from 'components/Button';
import useAuth from 'hooks/useAuth';
import Avatar from 'components/Avatar';
import Icon from 'components/Icon';
import { humanizeTime } from 'utils/time';

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

  const isAcknowledged =
    data?.data?.result?.data?.[0]?.myAcknowledgement?.reaction !== 'mark_read';

  return (
    <div>
      <div className="flex justify-between items-center mt-4">
        <div className="text-base font-bold">Announcements</div>
        <div className="text-sm font-bold">View All</div>
      </div>
      <div>
        <Card className="pb-6 flex flex-col items-center rounded-9xl">
          <div className="rounded-t-9xl bg-blue-700 text-white py-3 w-full flex justify-start space-x-1 px-3">
            <Icon name="flashIcon" />
            <div className="text-base font-bold">Announcement</div>
          </div>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div>
              {isAcknowledged ? (
                <div className="flex flex-col justify-center items-center">
                  <div className="px-3 mt-5">
                    <div className="flex items-center space-x-3">
                      <div>
                        <Avatar
                          name={
                            data?.data?.result?.data?.[0]?.createdBy
                              ?.fullName || 'U'
                          }
                          image=""
                          size={40}
                        />
                      </div>
                      <div>
                        <div className="space-x-1 text-sm">
                          <b>{user?.name}</b>
                          <span>Shared a post</span>
                        </div>
                        <div className="text-xs">
                          {humanizeTime(
                            data?.data?.result?.data?.[0]?.createdAt,
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 flex justify-center items-center">
                      {data?.data?.result?.data[0]?.content?.text}
                    </div>
                  </div>
                  <Button
                    label="Mark as read"
                    variant={Variant.Secondary}
                    className="border-2 border-neutral-200 mt-4 w-[75%]"
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
