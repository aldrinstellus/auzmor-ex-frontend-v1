import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Card from 'components/Card';
import {
  announcementRead,
  fetchAnnouncement,
  useAnnouncements,
} from 'queries/post';
import Button, { Variant } from 'components/Button';
import useAuth from 'hooks/useAuth';
import Avatar from 'components/Avatar';
import Icon from 'components/Icon';
import { humanizeTime } from 'utils/time';

export interface IAnnouncementCardProps {}

const AnnouncementCard: React.FC<IAnnouncementCardProps> = () => {
  const acknowledgeAnnouncement = useMutation({
    mutationKey: ['acknowledgeAnnouncement'],
    mutationFn: announcementRead,
    onError: (error) => console.log(error),
    onSuccess: (data, variables, context) => {
      console.log('data==>', data);
    },
  });

  const { data, isLoading } = useAnnouncements();

  const { user } = useAuth();

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
          {/* <div className="flex justify-center items-center text-white text-xs font-bold space-x-4 py-3 bg-blue-700">
          </div> */}
          <div className="px-3 mt-5">
            <div className="flex items-center space-x-3">
              <div>
                <Avatar name={user?.name || ''} image="" size={40} />
              </div>
              <div>
                <div className="space-x-1 text-sm">
                  <b>{user?.name}</b>
                  <span>Shared a post</span>
                </div>
                <div className="text-xs">
                  {humanizeTime(data?.data?.result?.data[0].createdAt)}
                </div>
              </div>
            </div>
            <div className="mt-5">
              {data?.data?.result?.data[0]?.content?.text}
            </div>
          </div>
          <Button
            label="Mark as read"
            variant={Variant.Tertiary}
            className="border-2 border-neutral-200 mt-4"
            onClick={() => {
              acknowledgeAnnouncement.mutate({
                entityId: data?.data?.result?.data[0].id,
                entityType: 'post',
                type: 'acknowledge',
                reaction: 'mark_read',
              });
            }}
          />
        </Card>
      </div>
    </div>
  );
};

export default AnnouncementCard;
