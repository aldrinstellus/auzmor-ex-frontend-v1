import React, { FC } from 'react';
import { LinkAttachment } from 'interfaces';
import { ProductEnum } from 'utils/apiService';
import { getItem } from 'utils/persist';
import Icon from 'components/Icon';
import moment from 'moment';

interface ILinkAttachmentsProps {
  attachments: LinkAttachment[];
}

const lxpBaseUrl =
  getItem(`${ProductEnum.Lxp}RegionUrl`) ||
  process.env.REACT_APP_LXP_BACKEND_BASE_URL;

export const downloadAttachment = (
  attachmentId: string,
  name = 'excel',
  onlyTargetBlank = false,
) => {
  const downloadUrl = `${lxpBaseUrl}/attachments/${attachmentId}/download?auth_token=${getItem(
    'uat',
  )}`;
  //@ts-ignore
  if (!window.navigator.msSaveOrOpenBlob && !onlyTargetBlank) {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
  } else {
    window.open(downloadUrl, '_blank');
  }
};

const getAuthLxpUrl = (attachmentId: string) =>
  `${lxpBaseUrl}/attachments/${attachmentId}/preview?auth_token=${getItem(
    'uat',
  )}&t=${moment()}`;

const isImageRegex = /\.(jpg|png|gif|jpeg)$/i;
const isVideoRegex = /\.(avi|mp4|mov|wmv|mpg|m4v)$/i;
const isExcelRegex = /\.(xlsx|xlsb|xlsm|xls)$/i;
const isDocumentRegex = /\.(pdf|doc|docx|ppt|pptx)$/i;

const getIconName = (title: string): string => {
  if (isExcelRegex.test(title)) {
    return 'xls';
  } else if (isImageRegex.test(title)) {
    return 'imageFile';
  } else if (isVideoRegex.test(title)) {
    return 'videoFile';
  } else if (isDocumentRegex.test(title)) {
    if (title.toLowerCase().endsWith('.pdf')) {
      return 'pdf';
    } else if (
      title.toLowerCase().endsWith('.doc') ||
      title.toLowerCase().endsWith('.docx')
    ) {
      return 'doc';
    } else if (
      title.toLowerCase().endsWith('.ppt') ||
      title.toLowerCase().endsWith('.pptx')
    ) {
      return 'ppt';
    }
  }
  return 'doc';
};
const LinkAttachments: FC<ILinkAttachmentsProps> = ({ attachments }) => {
  const handleAttachmentClick = (each: LinkAttachment) => {
    const attachmentId = each.url.split('/attachments/')[1].split('/')[0];
    const previewUrl = getAuthLxpUrl(attachmentId);

    if (isExcelRegex.test(each.title)) {
      downloadAttachment(
        attachmentId,
        each.title.substring(0, each.title.lastIndexOf('.')),
      );
    } else if (isImageRegex.test(each.title) || isVideoRegex.test(each.title)) {
      window.open(previewUrl, '_blank');
    } else {
      let targetUrl = previewUrl;
      if (isDocumentRegex.test(each.title)) {
        targetUrl =
          'https://docs.google.com/viewer?url=' +
          encodeURIComponent(previewUrl);
      }
      window.open(targetUrl, '_blank'); // others file extension
    }
  };

  return (
    <div className="flex gap-2">
      {attachments.map((each) => {
        return (
          <div
            key={each._id}
            onClick={() => handleAttachmentClick(each)}
            className="flex p-2 rounded-9xl border border-neutral-200 w-[173px] items-center gap-2 cursor-pointer hover:shadow-lg transition"
          >
            <Icon name={getIconName(each.title)} />
            <p className="text-xs font-medium max-w-[124px] truncate">
              {each.title.substring(0, each.title.lastIndexOf('.'))}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default LinkAttachments;
