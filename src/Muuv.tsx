import React, { useEffect, useState } from 'react';
import useStore from '@store/store';
import i18n from './i18n';

import Chat from '@components/Chat';
import Menu from '@components/Menu';

import useInitialiseNewChat from '@hooks/useInitialiseNewChat';
import { ChatInterface } from '@type/chat';
import { Theme } from '@type/theme';
import ApiPopup from '@components/ApiPopup';
import Toast from '@components/Toast';
import Login from '@components/Login/Login';

function App() {
  const initialiseNewChat = useInitialiseNewChat();
  const setChats = useStore((state) => state.setChats);
  const setTheme = useStore((state) => state.setTheme);
  const setApiKey = useStore((state) => state.setApiKey);
  const setCurrentChatIndex = useStore((state) => state.setCurrentChatIndex);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    i18n.on('languageChanged', (lng) => {
      document.documentElement.lang = lng;
    });
  }, []);

  useEffect(() => {
    // legacy local storage
    const oldChats = localStorage.getItem('chats');
    const apiKey = localStorage.getItem('apiKey');
    const theme = localStorage.getItem('theme');

    if (apiKey) {
      // legacy local storage
      setApiKey(apiKey);
      localStorage.removeItem('apiKey');
    }

    if (theme) {
      // legacy local storage
      setTheme(theme as Theme);
      localStorage.removeItem('theme');
    }

    if (oldChats) {
      // legacy local storage
      try {
        const chats: ChatInterface[] = JSON.parse(oldChats);
        if (chats.length > 0) {
          setChats(chats);
          setCurrentChatIndex(0);
        } else {
          initialiseNewChat();
        }
      } catch (e: unknown) {
        console.log(e);
        initialiseNewChat();
      }
      localStorage.removeItem('chats');
    } else {
      // existing local storage
      const chats = useStore.getState().chats;
      const currentChatIndex = useStore.getState().currentChatIndex;
      if (!chats || chats.length === 0) {
        initialiseNewChat();
      }
      if (
        chats &&
        !(currentChatIndex >= 0 && currentChatIndex < chats.length)
      ) {
        setCurrentChatIndex(0);
      }
    }
    const checkLoggedInStatus = async () => {
      const apiEndpoint = new URL(import.meta.env.VITE_DEFAULT_API_ENDPOINT);
      apiEndpoint.pathname = ( apiEndpoint.hostname.startsWith('api.') || apiEndpoint.hostname.match(/localhost/) )
        ? '/me'
        : '/api/me'

      const response = await fetch(apiEndpoint.toString(), { method: 'GET', credentials: 'include' });
      const isValidResponse = response.status === 200 
      setIsLoggedIn(isValidResponse);
    };
    checkLoggedInStatus();
  }, []);

  return (
    <div className='overflow-hidden w-full h-full relative'>
      <UsersOnly /> 
    </div>
  );

  function UsersOnly(){
    return isLoggedIn 
      ? <ChatGPT /> 
      : <Login />
  }

  function ChatGPT(){
    return <>
      <Menu />
      <Chat />
      <ApiPopup />
      <Toast />
    </>
  }
}

export default App;