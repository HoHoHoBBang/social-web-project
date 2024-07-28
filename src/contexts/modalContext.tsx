import React, { createContext, useReducer, useState } from "react";
import {
  ChildrenProps,
  ModalReducerActionType,
  ModalReducerInitialStateProps,
} from "../assets/types/postType";
import { modalInitialState, modalReducer } from "./modalReducer";

interface ModalContextProps {
  state: ModalReducerInitialStateProps;
  dispatch: React.Dispatch<ModalReducerActionType>;
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  postModalOpen: boolean;
  setPostModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  followModalOpen: boolean;
  setFollowModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalContext = createContext<ModalContextProps>({
  state: modalInitialState,
  dispatch: () => {},
  modalOpen: false,
  setModalOpen: () => {},
  postModalOpen: false,
  setPostModalOpen: () => {},
  followModalOpen: false,
  setFollowModalOpen: () => {},
});

export const ModalContextProvider = ({ children }: ChildrenProps) => {
  const [state, dispatch] = useReducer(modalReducer, modalInitialState);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [postModalOpen, setPostModalOpen] = useState<boolean>(false);
  const [followModalOpen, setFollowModalOpen] = useState<boolean>(false);

  return (
    <ModalContext.Provider
      value={{
        state,
        dispatch,
        modalOpen,
        setModalOpen,
        postModalOpen,
        setPostModalOpen,
        followModalOpen,
        setFollowModalOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
