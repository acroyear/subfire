import { buildProcessEnvCredentials, SubsonicProvider, useChatMessages, useNowPlaying } from '@subfire/hooks';
import { LoadingCard } from '..';

export default {
    title: 'hooks/useSubfireHooks'
};

const SubsonicWrapper: React.FC<any> = (props) => {
    console.warn(props);
    return (
        <SubsonicProvider
            clientName="SubfireStorybook"
            embeddedCredentials={props.embeddedCredentials}
            LoadingCardComponent={LoadingCard}
        >
            {props.children}
        </SubsonicProvider>
    );
};

const NowPlayingInner = (_p: any) => {
    const [nps, delay, setDelay] = useNowPlaying();
    return (<>
        {JSON.stringify(nps)}
    </>);
}

export const NowPlayingTest = (_p: any) => {
    const credentials = buildProcessEnvCredentials();
    console.warn(credentials);
    return (
        <SubsonicWrapper embeddedCredentials={credentials}>
            <NowPlayingInner></NowPlayingInner>
        </SubsonicWrapper>);
}

const Input = (props: any) => {
    const { handler } = props;
    const handleKeyDown = (event: any) => {
      if (event.key === 'Enter') {
        if (handler) {
            handler(event.target.value);
        }
        event.target.value = '';
      }
    }
  
    return <input type="text" onKeyDown={handleKeyDown} />
  }

const ChatMessageInner = (_p: any) => {
    const [cm, addCm, delay, setDelay] = useChatMessages();
    const handleKeyDown = (x: string):void => {
        addCm(x);
    }
    return (<>
        <Input handler={handleKeyDown}></Input>
        {JSON.stringify(cm)}
    </>);
}

export const ChatMessagesTest = (_p: any) => {
    const credentials = buildProcessEnvCredentials();
    console.warn(credentials);
    return (
        <SubsonicWrapper embeddedCredentials={credentials}>
            <ChatMessageInner></ChatMessageInner>
        </SubsonicWrapper>);
}