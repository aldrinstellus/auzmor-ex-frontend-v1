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

  console.log(data?.data?.result?.data[0].id, 'DATA');

  const { user } = useAuth();

  return (
    <div>
      <div className="flex justify-between items-center mt-4">
        <div className="text-base font-bold">Announcements</div>
        <div className="text-sm font-bold">View All</div>
      </div>
      <div>
        <Card className="p-6 flex flex-col items-center rounded-9xl">
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center space-x-3">
              <div>
                <Avatar name={user?.name || ''} image="" />
              </div>
              <div>
                {user?.name}
                Shared a post
                <div className="">
                  {data?.data?.result?.data[0].createdAt}ago
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
