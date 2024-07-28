import React, { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./authContext";
import {
  ChatContextProps,
  ChatReducerActionType,
  ChatReducerProps,
  ChildrenProps,
} from "../assets/types/postType";

const InitialState = {
  chatId: "null",
  userId: "null",
};

export const ChatContext = createContext<ChatContextProps>({
  state: InitialState,
  dispatch: () => undefined,
});

export const ChatContextProvider = ({ children }: ChildrenProps) => {
  const { currentUser } = useContext(AuthContext);

  const chatReducer = (
    state: ChatReducerProps,
    action: ChatReducerActionType,
  ): ChatReducerProps => {
    switch (action.type) {
      case "CHANGEUSER":
        if (!action.payload || !currentUser) {
          return {
            chatId: "null",
            userId: "null",
          };
        }
        return {
          userId: action.payload,
          chatId:
            currentUser.uid > action.payload
              ? currentUser.uid + action.payload
              : action.payload + currentUser.uid,
        };
      case "INITIAL":
        return {
          chatId: "null",
          userId: "null",
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, InitialState);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
