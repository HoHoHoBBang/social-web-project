import { User } from "firebase/auth";
import React from "react";

export interface UserProfileProps {
  dark: boolean;
  email: string;
  follower: string[];
  following: string[];
  online: boolean;
  posts: string[];
  uid: string;
  userInfo: {
    backgroundPhotoURL: string | null;
    birth: string;
    displayName: string;
    introduce: string;
    job: string;
    photoURL: string | null;
  };
}

export interface CommentsProps {
  comment: string;
  createdAt: number;
  createdBy: string;
  id: string;
}

export interface PostProps {
  id: string;
  text: string;
  likes: string[];
  bookmarks: string[];
  comments: CommentsProps[];
  createdAt: number;
  createdBy: string;
  files: string[];
}

export interface LoginProps {
  email: string;
  password: string;
}

export interface ChildrenProps {
  children: React.ReactNode;
}

export interface UserChatProps {
  date: {
    createdAt: number;
    date: string;
    time: string;
  };
  lastMessage: {
    text: string;
  };
  uid: string;
  userLastMessage?: {
    isChecked: boolean;
    text: string;
  };
}

export interface MessageProps {
  date: string;
  id: string;
  senderId: string;
  text: string;
  time: string;
}

export interface SingleMessageProps {
  message: MessageProps;
}

export interface SignupProps {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}

export interface EventInputProps {
  title: string;
  description: string;
  date: string;
  color: string;
  createdAt: number;
  id: string;
}

export interface EventReducerInitialStateProps {
  open?: boolean;
  wide?: boolean;
}

export interface EventReducerActionType {
  type: string;
}

export interface EventColorListProps {
  color: string;
  name: string;
}

export interface ShareFileProps {
  name: string;
  url: string;
}

export interface ModalReducerInitialStateProps {
  name: string;
  data?: PostProps;
}

export interface ModalReducerActionType {
  type:
    | "LOGOUT"
    | "POSTDELETE"
    | "USERDELETE"
    | "VIEWPOST"
    | "FOLLOWER"
    | "FOLLOWING"
    | "INITIAL";
  payload?: PostProps;
}

export interface MenuReducerInitialStateProps {
  menu: string;
}

export interface MenuReducerActionType {
  type: string;
}

export interface MenuContextProps {
  state: MenuReducerInitialStateProps;
  dispatch: React.Dispatch<MenuReducerActionType>;
}

export interface NotificationProps {
  createdAt: number;
  date: string;
  id: string;
  postId?: string;
  isChecked: boolean;
  time: string;
  type: string;
  uid: string;
}

export interface ImageProps {
  name: string;
  url: string;
}

export interface InfoInputProps {
  job: string;
  introduce: string;
  displayName: string;
}
export interface InfoBirthInputProps {
  birth: string;
}

export interface EditProfileContextProps {
  edit: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  profileImage: ImageProps[];
  backgroundImage: ImageProps[];
  setEditHandler: () => void;
  infoInput: InfoInputProps;
  setInfoInput: React.Dispatch<React.SetStateAction<InfoInputProps>>;
  birthInput: InfoBirthInputProps;
  setBirthInput: React.Dispatch<React.SetStateAction<InfoBirthInputProps>>;
  submitHandler: () => void;
  cancelHandler: () => void;
  imageUpdateHandler: (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => void;
  deleteHandler: (id: string) => void;
  displayNameErr: boolean;
  setDisplayNameErr: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ChatReducerProps {
  userId: string;
  chatId: string;
}

export interface ChatReducerActionType {
  type: string;
  payload?: string;
}

export interface ChatContextProps {
  state: ChatReducerProps;
  dispatch: React.Dispatch<ChatReducerActionType>;
}

export interface PageReducerInitialStateProps {
  page: string;
}

export interface PageReducerActionType {
  type: string;
}

export interface PageContextProps {
  state: PageReducerInitialStateProps;
  dispatch: React.Dispatch<PageReducerActionType>;
}

export interface AuthContextProps {
  currentUser: User | null;
}
