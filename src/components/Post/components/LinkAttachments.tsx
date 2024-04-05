import Icon from 'components/Icon';
import moment from 'moment';
import { LinkAttachment } from 'queries/post';
import { FC } from 'react';
import { ProductEnum } from 'utils/apiService';
import { getItem } from 'utils/persist';

interface ILinkAttachmentsProps {
  attachments: LinkAttachment[];
}

const LinkAttachments: FC<ILinkAttachmentsProps> = ({ attachments }) => {
  const getAuthLearnUrl = `${
    getItem(`${ProductEnum.Learn}RegionUrl`) ||
    process.env.REACT_APP_LEARN_BACKEND_BASE_URL
  }/attachments/`;
  const isImageRegex = /(?:\.jpg|\.png|\.gif|\.jpeg)$/i;
  const isVideoRegex = /(?:\.avi|\.mp4|\.mov|\.wmv|\.mpg|\.m4v)$/i;

  return (
    <div className="flex gap-2">
      {attachments.map((each) => {
        const attachmentId = each?.url.split('/attachments/')[1].split('/')[0];
        const previewUrl = `${getAuthLearnUrl}${attachmentId}/preview?auth_token=${getItem(
          'uat',
        )}&t=${moment()}`;

        return (
          <div
            key={each._id}
            onClick={() => window.open(previewUrl)}
            className="flex p-2 rounded-9xl border border-neutral-200 w-[173px]  items-center gap-2 cursor-pointer hover:shadow-lg transition"
          >
            {isImageRegex.test(each?.title) && (
              <div className="flex w-6 h-6">
                <img src={previewUrl} />
              </div>
            )}
            {isVideoRegex.test(each?.title) && (
              <div className="flex w-6 h-6">
                <video src={previewUrl} controls={false} />
              </div>
            )}

            <Icon
              name={each?.title?.substring(each?.title.lastIndexOf('.') + 1)}
            />
            <p className="text-xs font-medium max-w-[124px] truncate">
              {each?.title.substring(0, each?.title.lastIndexOf('.'))}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default LinkAttachments;
