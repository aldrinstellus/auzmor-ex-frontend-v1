import Icon from 'components/Icon';

const Congrats = () => {
  return (
    <div
      className="bg-white rounded-9xl py-4 mt-6"
      data-testid="channel-welcome-abord-post"
    >
      <div className="flex justify-end px-4">
        <Icon name="close" size={20} />
      </div>
      <div className="flex justify-between p-4">
        <div>
          <img
            src={require('images/ChannelCover/channelDone.png')}
            className="h-[210px]"
            alt="Channel congrats Picture"
          />
        </div>
        <div className="flex flex-col items-center flex-1 py-4">
          <div className="text-2xl font-semibold">Congratulations!</div>
          <div className="mt-4 font-medium">
            <div className="text-center text-xs">
              You have finished setting up your profile
            </div>
            <div className="text-center text-xs mt-6">
              Now you can invite more people to your channel so that your
              channel reaches to a bigger audience.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Congrats;
