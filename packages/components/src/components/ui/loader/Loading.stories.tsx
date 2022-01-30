import { FuzzyImageBackground, LoadingCard } from '../../..';

// TODO: turn this into some sort of decorator
import { Subsonic, utils } from '@subfire/core';

const credentials = {
  server: process.env.sf_server,
  username: process.env.sf_username,
  password: process.env.sf_password,
  bitrate: process.env.sf_bitrate,
  clientName: "SubFire4Storybook"
};
const {
  server,
  username,
  password,
  bitrate,
  clientName = "SubsonicStorybook",
} = credentials;

export default {
  title: 'ui/loading'
};

export const A_LoadingCard = (_props: any) => {
  Subsonic.configure(server, username, password, bitrate, clientName, false);
  const cardProps1 = {
    object: {
      name: 'The Playlist',
      id: '44',
      coverArt: 'pl-44'
    },
    top: 0
  };

  const initialStates = {
    default: {
      backgroundAttachment: 'fixed',
      backgroundPosition: 'calc(100% - 50%) calc(100% - 15%)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '170%',
      opacity: 0.35,
      filter: 'blur(20px)'
    }
  };
  const currentState = "default";
  const currentImage = Subsonic.getCoverArtURL(cardProps1.object.coverArt);

  return (
    <>
      <FuzzyImageBackground states={initialStates} currentState={currentState} currentImage={currentImage}>
        <LoadingCard {...cardProps1} />
      </FuzzyImageBackground>
    </>
  );
};

export const GenericLoadingCard = (_props: any) => {
  Subsonic.configure(server, username, password, bitrate, clientName, false);
  const cardProps1 = {
    object: {
      name: 'Something...',
      id: '-1',
      coverArt: '-1'
    },
    top: 0
  };
  const initialStates = {
    default: {
      backgroundAttachment: 'fixed',
      backgroundPosition: 'calc(100% - 50%) calc(100% - 15%)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '170%',
      opacity: 0.35,
      filter: 'blur(20px)'
    }
  };
  const currentState = "default";
  const currentImage = Subsonic.getCoverArtURL(cardProps1.object.coverArt);

  return (
    <>
      <FuzzyImageBackground states={initialStates} currentState={currentState} currentImage={currentImage}>
        <LoadingCard {...cardProps1} />
      </FuzzyImageBackground>
    </>
  );
}

