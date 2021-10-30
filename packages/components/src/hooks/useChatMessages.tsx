import { useEffect } from 'react';

import { SubsonicTypes } from '@subfire/core';
import { useSubsonic } from './SubsonicContext';
import { createGlobalState, useInterval } from 'react-use';

export const useChatMessagesLastFetchTime = createGlobalState<number>();
export const useChatMessagesState = createGlobalState<SubsonicTypes.ChatMessageEntities>([]);
export const useChatMessagesScanner = createGlobalState<number>(5000);

export const useChatMessages = (): [SubsonicTypes.ChatMessageEntities, (x: string) => Promise<any>, number, (i: number) => void] => {
  const { isLoggedIn, Subsonic } = useSubsonic();
  const [np, setChatMessages] = useChatMessagesState();
  const [delay, setDelay] = useChatMessagesScanner();

  const loadChatMessages = async () => {
    const nps = await Subsonic.getChatMessages();
    setChatMessages(nps.chatMessage || []);
    return nps;
  };

  useInterval(() => {
    loadChatMessages().then((cp) => { console.debug(cp); });
  }, isLoggedIn && delay ? delay : null);

  useEffect(() => {
    // console.warn(isLoggedIn, !delay, delay);
    if (isLoggedIn && !delay) {
      loadChatMessages().then((cp) => { console.debug(cp); });
    }
  }, [isLoggedIn, delay]);

  const addChatMessage = (x: string): Promise<any> => {
    const a = Subsonic.addChatMessage(x).then(() =>
      loadChatMessages().then((cp) => { console.debug(cp); })
    );
    return a;
  }

  return [np, addChatMessage, delay, setDelay];
};

export default useChatMessages;
