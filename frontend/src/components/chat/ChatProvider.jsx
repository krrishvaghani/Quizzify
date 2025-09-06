import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const useChatbot = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentContext, setCurrentContext] = useState({
    topic: null,
    question: null
  });

  const openChat = (context = {}) => {
    setCurrentContext(prev => ({ ...prev, ...context }));
    setIsChatOpen(true);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  const updateContext = (newContext) => {
    setCurrentContext(prev => ({ ...prev, ...newContext }));
  };

  const value = {
    isChatOpen,
    currentContext,
    openChat,
    closeChat,
    toggleChat,
    updateContext
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
