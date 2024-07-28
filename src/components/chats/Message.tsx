import React, { useContext, useEffect, useRef } from "react";
import { SingleMessageProps } from "../../assets/types/postType";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import { AuthContext } from "../../contexts/authContext";
import person from "../../assets/images/person.png";
import { Navigate } from "react-router-dom";

const Message = ({ message }: SingleMessageProps) => {
  const { currentUser } = useContext(AuthContext);
  const { userProfile } = useGetUserProfile(message.senderId);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView();
  }, [message]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center ${message.senderId === currentUser.uid ? "justify-end" : null}`}
    >
      <div
        className={`flex w-full gap-1 ${message.senderId === currentUser.uid ? "flex-row-reverse" : null}`}
      >
        <img
          className="h-9 w-9 rounded-full border bg-white object-cover"
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL !== null
                ? currentUser.photoURL
                : person
              : userProfile?.userInfo.photoURL !== null
                ? userProfile?.userInfo.photoURL
                : person
          }
          alt="User"
        />
        <div
          className={`flex w-full flex-col gap-1 ${message.senderId === currentUser.uid ? "flex-wrap-reverse" : null}`}
        >
          <p
            className={`flex text-sm dark:text-white ${message.senderId === currentUser.uid ? "justify-end" : null}`}
          >
            {message.senderId === currentUser.uid
              ? currentUser.displayName
              : userProfile?.userInfo.displayName}
          </p>
          <div
            className={`flex gap-1 ${message.senderId === currentUser.uid ? "flex-row-reverse" : null}`}
          >
            <div
              className={`flex h-fit w-fit max-w-[50%] break-all rounded-b-xl p-2 ${message.senderId === currentUser.uid ? "rounded-l-xl bg-yellow-300" : "rounded-r-xl bg-blue-300"}`}
            >
              <p
                className={`flex ${message.senderId === currentUser.uid ? "justify-end" : null}`}
              >
                {message.text}
              </p>
            </div>
            <span className="flex text-xs text-gray-500">{message.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
