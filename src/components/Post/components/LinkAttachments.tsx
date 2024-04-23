import React, { FC } from 'react';
import moment from 'moment';
import { toast } from 'react-toastify';
import { LinkAttachment } from 'queries/post';
import { ProductEnum } from 'utils/apiService';
import { TOAST_AUTOCLOSE_TIME } from 'utils/constants';
import { twConfig } from 'utils/misc';
import { getItem } from 'utils/persist';
import { slideInAndOutTop } from 'utils/react-toastify';
import Icon from 'components/Icon';
import FailureToast from 'components/Toast/variants/FailureToast';

interface ILinkAttachmentsProps {
  attachments: LinkAttachment[];
}

const LinkAttachments: FC<ILinkAttachmentsProps> = ({ attachments }) => {
  const learnBaseUrl =
    getItem(`${ProductEnum.Learn}RegionUrl`) ||
    process.env.REACT_APP_LEARN_BACKEND_BASE_URL;

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
      toast(<FailureToast content={'oops, preview is not supported'} />, {
        closeButton: (
          <Icon name="closeCircleOutline" color="text-red-500" size={20} />
        ),
        style: {
          border: `1px solid ${twConfig.theme.colors.red['300']}`,
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
        },
        autoClose: TOAST_AUTOCLOSE_TIME,
        transition: slideInAndOutTop,
        theme: 'dark',
      });
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
