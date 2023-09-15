import Accordion from 'components/Accordion';
import React from 'react';
import PostsControl from './PostsControl';
import MentionsControl from './MentionsControl';
import EventsControl from './EventsControl';

const GeneralSetting = () => {
  return (
    <div className="space-y-4">
      <Accordion title="Posts" content={<PostsControl data={{}} />} />
      <Accordion title="Mentions" content={<MentionsControl data={{}} />} />
      <Accordion title="Events" content={<EventsControl data={{}} />} />
    </div>
  );
};

export default GeneralSetting;
