import { FC } from 'react';
import { LinkAttachment } from 'queries/post';
import { ProductEnum } from 'utils/apiService';

import { getItem } from 'utils/persist';
import Icon from 'components/Icon';
import moment from 'moment';

interface ILinkAttachmentsProps {
  attachments: LinkAttachment[];
}

const learnBaseUrl =
  getItem(`${ProductEnum.Learn}RegionUrl`) ||
  process.env.REACT_APP_LEARN_BACKEND_BASE_URL;
export const downloadAttachment = (
  attachmentId = '',
  name = 'excel',
  onlyTargetBlank = false,
) => {
  const downloadUrl = `${learnBaseUrl}/attachments/${attachmentId}/download?auth_token=${getItem(
    'uat',
  )}`;
  // If IE, fallback to old method
  // @ts-ignore
  if (!window.navigator.msSaveOrOpenBlob && !onlyTargetBlank) {
    // Create anchor tag to enforce download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
  } else {
    window.open(downloadUrl, '_blank');
  }
};

const LinkAttachments: FC<ILinkAttachmentsProps> = ({ attachments }) => {
  const getAuthLearnUrl = (attachmentId: string) =>
    `${learnBaseUrl}/attachments/${attachmentId}/preview?auth_token=${getItem(
      'uat',
    )}&t=${moment()}`;

  const isImageRegex = /\.(jpg|png|gif|jpeg)$/i;
  const isVideoRegex = /\.(avi|mp4|mov|wmv|mpg|m4v)$/i;
  const isExcelRegex = /\.(xlsx|xls)$/i;

  const handleAttachmentClick = (each: LinkAttachment) => {
    const attachmentId = each.url.split('/attachments/')[1].split('/')[0];
    const previewUrl = getAuthLearnUrl(attachmentId);

    if (isExcelRegex.test(each.title)) {
      downloadAttachment(
        each.url.split('/attachments/')[1].split('/')[0],
        each.title.substring(0, each.title.lastIndexOf('.')),
      );
    } else {
      if (isImageRegex.test(each.title) || isVideoRegex.test(each.title)) {
        window.open(previewUrl, '_blank');
      } else {
        // for pdf,docs and ppt
        const viewerUrl =
          'https://docs.google.com/viewer?url=' +
          encodeURIComponent(previewUrl);
        window.open(viewerUrl, '_blank');
      }
    }
  };

  return (
    <div className="flex gap-2">
      {attachments.map((each) => (
        <div
          key={each._id}
          onClick={() => handleAttachmentClick(each)}
          className="flex p-2 rounded-9xl border border-neutral-200 w-[173px] items-center gap-2 cursor-pointer hover:shadow-lg transition"
        >
          {isImageRegex.test(each.title) && (
            <div className="flex w-6 h-6">
              <img src={getAuthLearnUrl(each._id)} alt="attachment preview" />
            </div>
          )}
          {isVideoRegex.test(each.title) && (
            <div className="flex w-6 h-6">
              <video src={getAuthLearnUrl(each._id)} controls={false} />
            </div>
          )}
          <Icon name={each.title.substring(each.title.lastIndexOf('.') + 1)} />
          <p className="text-xs font-medium max-w-[124px] truncate">
            {each.title.substring(0, each.title.lastIndexOf('.'))}
          </p>
        </div>
      ))}
    </div>
  );
};

export default LinkAttachments;
