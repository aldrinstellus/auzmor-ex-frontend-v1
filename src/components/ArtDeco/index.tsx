import React, { useState } from 'react';
import { Card } from '@auzmorui/component-library.components.card';
import { Avatar } from '@auzmorui/component-library.components.avatar';

import { Button } from '@auzmorui/component-library.components.button';

import Media from 'images/media.svg';
import Shoutout from 'images/shoutout.svg';
import Events from 'images/events.svg';
import Polls from 'images/polls.svg';
import Modal from 'components/Modal';
import CreatePost from 'components/CreatePost';
import { IFeed } from 'pages/Feed';
import { EditorContentChanged } from 'components/RichTextEditor';

type ArtDecoProps = {
  activityFeed: IFeed[];
  setActivityFeed: (feed: IFeed[]) => void;
};

const postTypeMapIcons = [
  {
    id: 1,
    label: 'Media',
    icon: <img src={Media} width={32} height={32} />,
  },
  {
    id: 2,
    label: 'Shoutout',
    icon: <img src={Shoutout} width={32} height={32} />,
  },
  {
    id: 3,
    label: 'Events',
    icon: <img src={Events} width={32} height={32} />,
  },
  {
    id: 4,
    label: 'Polls',
    icon: <img src={Polls} width={32} height={32} />,
  },
];

const ArtDeco: React.FC<ArtDecoProps> = ({ activityFeed, setActivityFeed }) => {
  const [open, setOpen] = useState(false);
  const [htmlValue, setHtmlValue] = useState<any>('');

  const onEditorContentChanged = (content: EditorContentChanged) => {
    setHtmlValue(content);
  };

  console.log(htmlValue);

  return (
    <div>
      <Card className="bg-white rounded-9xl">
        <div className="flex items-center px-6 pt-6 pb-3">
          <Avatar
            size={32}
            image="https://png.pngtree.com/png-clipart/20210619/ourlarge/pngtree-instagram-lady-social-media-flat-style-avatar-png-image_3483977.jpg"
            name={''}
            active={false}
          />
          {/* replace with component library */}
          <input
            type="input"
            className="w-135.25 h-11 border border-neutral-200 rounded-19xl ml-3 px-5 py-3 text-sm font-medium outline-none"
            readOnly
            onClick={() => {
              setOpen(true);
            }}
            placeholder="What's on your mind?"
          />
        </div>
        <div className="flex justify-between mx-8.5">
          {postTypeMapIcons.map((type) => (
            <div key={type.id}>
              <div className="flex items-center py-3">
                {type.icon}
                <span className="text-neutral-500 text-xs font-normal ml-3">
                  {type.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        open={open}
        setOpen={setOpen}
        title="Create a post"
        body={<CreatePost onChangeEditor={onEditorContentChanged} />}
        footer={
          <div className="flex justify-between items-center h-16 p-6">
            <div className="flex">
              {postTypeMapIcons.map((type) => (
                <div className="mr-4" key={type.id}>
                  <button>{type.icon}</button>
                </div>
              ))}
            </div>
            <div className="flex items-center">
              <div></div>
              <Button
                label={'Post'}
                className="bg-primary-500 rounded-3xl text-white w-20"
                onClick={() => {
                  const newFeed = {
                    content: {
                      text: 'Basic Plaint Text',
                      html: htmlValue.html,
                      editor: '',
                    },
                    uuid: `45ba1474-649e-4664-b5ca-b552ba509635${
                      activityFeed.length + 1
                    }`,
                    createdAt: '2023-04-14T04:42:15.562Z',
                    updatedAt: '2023-04-14T04:42:15.562Z',
                    type: '',
                    isAnnouncement: true,
                  };
                  setActivityFeed([newFeed, ...activityFeed]);
                  setOpen(false);
                }}
              />
            </div>
          </div>
        }
      />
    </div>
  );
};

export default ArtDeco;
