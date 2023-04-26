import React, { useState } from 'react';
import Card from 'components/Card';
import Avatar from 'components/Avatar';
import Button from 'components/Button';
import { DeltaStatic } from 'quill';
import Modal from 'components/Modal';
import CreatePost from 'components/CreatePost';
import { EditorContentChanged } from 'components/RichTextEditor';
import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';
import Divider, { Variant as DividerVariant } from 'components/Divider';

const postTypeMapIcons = [
  {
    id: 1,
    label: 'Media',
    icon: <Icon name="imageFilled" fill="#000000" size={14} />,
  },
  {
    id: 2,
    label: 'Shoutout',
    icon: <Icon name="magicStarFilled" fill="#000000" size={14} />,
  },
  {
    id: 3,
    label: 'Events',
    icon: <Icon name="calendarFilledTwo" fill="#000000" size={14} />,
  },
  {
    id: 4,
    label: 'Polls',
    icon: <Icon name="chartFilled" fill="#000000" size={14} />,
  },
];

const CreatePostCard: React.FC = ({}) => {
  const [open, setOpen] = useState(false);
  const [htmlValue, setHtmlValue] = useState<any>('');
  const [jsonValue, setJsonValue] = useState<any>({} as DeltaStatic);

  const onEditorContentChanged = (content: EditorContentChanged) => {
    setHtmlValue(content.html);
    setJsonValue(content.json);
  };

  const Header: React.FC = () => (
    <div className="flex items-center justify-between h-14 p-4 border-b border-solid">
      <h3 className="text-lg text-black font-['manrope'] font-extrabold">
        Create a post
      </h3>
      <button
        className="p-1 ml-auto bg-transparent border-0 text-black opacity-1 float-right leading-none outline-none focus:outline-none"
        onClick={() => setOpen(false)}
      >
        <span className="bg-transparent text-black opacity-1 h-8 w-8 text-3xl block outline-none focus:outline-none">
          ×
        </span>
      </button>
    </div>
  );

  const Footer: React.FC = () => (
    <div className="flex justify-between items-center h-16 p-6 bg-blue-50">
      <div className="flex">
        {postTypeMapIcons.map((type) => (
          <div className="mr-4" key={type.id}>
            <Tooltip tooltipContent={type.label}>
              <div className="flex justify-center items-center w-8 h-8 bg-white border border-neutral-200 rounded-7xl">
                {type.icon}
              </div>
            </Tooltip>
          </div>
        ))}
        <div className="flex justify-center items-center w-8 h-8 mr-2">
          <Icon name="moreOutline" stroke="#000000" />
        </div>
        <Divider variant={DividerVariant.Vertical} className="!h-8" />
      </div>
      <div className="flex items-center">
        <div></div>
        <Button
          label={'Post'}
          disabled={!htmlValue.html || htmlValue.html === '<p><br></p>'}
          onClick={() => {
            setOpen(false);
          }}
        />
      </div>
    </div>
  );

  return (
    <div>
      <Card className="bg-white">
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
              <div className="flex items-center py-3">{type.icon}</div>
            </div>
          ))}
        </div>
      </Card>

      <Modal
        open={open}
        closeModal={() => setOpen(false)}
        title="this is title"
        body={
          <Card className="bg-white overflow-hidden">
            <Header />
            <CreatePost onChangeEditor={onEditorContentChanged} />
            <Footer />
          </Card>
        }
      />
    </div>
  );
};

export default CreatePostCard;
