import { LinkAttachment } from 'queries/post';
import React, { FC } from 'react';

interface ILinkAttachmentsProps {
  attachments: LinkAttachment[];
}

const LinkAttachments: FC<ILinkAttachmentsProps> = ({ attachments }) => {
  return (
    <div className="flex gap-2">
      {attachments.map((each) => (
        <div
          key={each.title}
          onClick={() => window.location.assign(each.title)}
          className="flex p-2 rounded-9xl border border-neutral-200 w-[173px] justify-center items-center gap-2 cursor-pointer hover:shadow-lg transition"
        >
          <div className="flex w-6 h-8">
            <img className="object-cover" src={each.image} />
          </div>
          <p className="text-xs font-medium max-w-[124px] truncate">
            {each.title}
          </p>
        </div>
      ))}
    </div>
  );
};

export default LinkAttachments;
