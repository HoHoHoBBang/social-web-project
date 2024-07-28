import React, { useContext, useEffect, useState } from "react";
import Message from "./Message";
import { doc, DocumentData, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { ChatContext } from "../../contexts/chatContext";
import { MessageProps } from "../../assets/types/postType";

const Messages = () => {
  const [message, setMessage] = useState([]);

  const { state } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "chats", state.chatId),
      (doc: DocumentData) => {
        doc.exists() && setMessage(doc.data().messages);
      },
    );

    return () => {
      unSub();
    };
  }, [state.chatId]);

  return (
    <div className="w-full">
      {message.map((data: MessageProps) => (
        <Message key={data.id} message={data} />
      ))}
    </div>
  );
};

export default Messages;
