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

  console.log(data, 'DATA');

  const { user } = useAuth();

  // console.log(useAnnouncements()?.data?.data, 'ANNOUNCEMENTS');

  return (
    <div>
      {/* {useAnnouncements('ANNOUNCEMENT', 1)?.data && ( */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="text-base font-bold">Announcements</div>
          <div className="text-sm font-bold">View All</div>
        </div>
        <div>
          <Card className="pb-10 flex flex-col items-center rounded-9xl">
            <div className="flex flex-col justify-center items-center">
              <div className="flex flex-col items-center">
                <div className="flex justify-center items-center">
                  <Avatar name={user?.name || ''} image="" />
                  <div>{user?.name}</div> shared a post
                </div>
                <div>
                  {
                    // useAnnouncements('ANNOUNCEMENT', 1)?.data?.data?.result
                    //   ?.data[0]?.content?.text
                  }
                </div>
              </div>
            </div>
            <Button
              label="Mark as read"
              variant={Variant.Tertiary}
              className="border-2 border-neutral-200"
            />
          </Card>
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default AnnouncementCard;
