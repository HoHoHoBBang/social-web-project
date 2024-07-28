import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/authContext";
import {
  arrayUnion,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import useGetUserProfile from "./useGetUserProfile";
import { ChatContext } from "../contexts/chatContext";
import getTime from "../utils/getTime";
import { v4 as uuid } from "uuid";
import { UserChatProps } from "../assets/types/postType";

const useChats = () => {
  const { currentUser } = useContext(AuthContext);
  const { userProfile } = useGetUserProfile(currentUser ? currentUser.uid : "");
  const { state, dispatch } = useContext(ChatContext);
  const { nowDate, nowTime } = getTime(new Date());
  const [chatList, setChatList] = useState<UserChatProps[]>([]);

  const [text, setText] = useState("");

  useEffect(() => {
    setText("");
  }, [state]);

  useEffect(() => {
    if (!currentUser) return;

    const getChats = () => {
      const unsub = onSnapshot(
        doc(db, "userChats", currentUser.uid),
        (doc: DocumentData) => {
          setChatList(doc.data());
        },
      );

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser]);

  const selectHandler = async (userId: string) => {
    if (!currentUser) return;

    const combinedId =
      currentUser.uid > userId
        ? currentUser.uid + userId
        : userId + currentUser.uid;

    try {
      const chatsRef = await getDoc(doc(db, "chats", combinedId));

      const currentUserChatsRef = await getDoc(
        doc(db, "userChats", currentUser.uid),
      );

      const userChatsRef = await getDoc(doc(db, "userChats", userId));

      if (!chatsRef.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
      }

      if (!currentUserChatsRef.exists()) {
        await setDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId]: {
            uid: userId,
          },
        });
      }

      if (
        currentUserChatsRef.exists() &&
        !Object.keys(currentUserChatsRef.data()).includes(combinedId)
      ) {
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId]: {
            uid: userId,
          },
        });
      }

      if (!userChatsRef.exists()) {
        await setDoc(doc(db, "userChats", userId), {
          [combinedId]: {
            uid: userProfile?.uid,
          },
        });
      }

      if (
        userChatsRef.exists() &&
        !Object.keys(userChatsRef.data()).includes(combinedId)
      ) {
        await updateDoc(doc(db, "userChats", userId), {
          [combinedId]: {
            uid: userProfile?.uid,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }

    dispatch({ type: "CHANGEUSER", payload: userId });
  };

  const sendHandler = async () => {
    if (!currentUser) return;

    const chatsRef = await getDocs(collection(db, "chats"));
    const chatIds = chatsRef.docs.map((doc) => doc.id);

    if (chatIds.includes(state.chatId)) {
      if (text.trim() !== "") {
        await updateDoc(doc(db, "chats", state.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: nowDate,
            time: nowTime,
          }),
        });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [state.chatId + ".lastMessage"]: {
            text,
          },
          [state.chatId + ".date"]: {
            date: nowDate,
            time: nowTime,
            createdAt: Date.now(),
          },
        });
        await updateDoc(doc(db, "userChats", state.userId), {
          [state.chatId + ".lastMessage"]: {
            text,
          },
          [state.chatId + ".userLastMessage"]: {
            text,
            isChecked: false,
          },
          [state.chatId + ".date"]: {
            date: nowDate,
            time: nowTime,
            createdAt: Date.now(),
          },
        });
      }

      setText("");
    }
  };

  const keyHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    } else if (text.trim() !== "") {
      e.code === "Enter" && sendHandler();
    }
  };

  return {
    chatList,
    selectHandler,
    sendHandler,
    text,
    setText,
    keyHandler,
  };
};

export default useChats;
