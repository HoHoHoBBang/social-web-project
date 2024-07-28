import React from "react";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import person from "../../assets/images/person.png";
import { Link } from "react-router-dom";
import useChats from "../../hooks/useChats";
import useGetNotification from "../../hooks/useGetNotification";
import { UserChatProps } from "../../assets/types/postType";

interface Props {
  data: UserChatProps;
}

const ChatNotifications = ({ data }: Props) => {
  const { selectHandler } = useChats();
  const { userProfile } = useGetUserProfile(data.uid);
  const { checkChat } = useGetNotification();

  return (
    <Link
      to={"/chats"}
      onClick={() => {
        selectHandler(data.uid);
        checkChat(data.uid);
      }}
      className="border-b"
    >
      <div className="group flex items-center gap-2 border-purple-500 p-2 transition-all duration-300 hover:border-l-8 hover:bg-purple-100 dark:border-neutral-900 dark:bg-neutral-500 dark:hover:bg-neutral-400">
        <img
          className="h-8 w-8 rounded-full border bg-white object-cover"
          src={
            userProfile?.userInfo.photoURL
              ? userProfile?.userInfo.photoURL
              : person
          }
          alt=""
        />
        <div className="group-hover:text-purple-500">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              <p className="max-w-14 font-bold dark:text-neutral-300 dark:group-hover:text-white">
                {userProfile?.userInfo.displayName}
              </p>
              <p className="max-w-36 overflow-hidden text-ellipsis whitespace-nowrap text-sm dark:text-neutral-300 dark:group-hover:text-white">
                {data.userLastMessage?.text}
              </p>
            </div>
            <div className="">
              <p className="text-xs dark:text-neutral-300 dark:group-hover:text-white">
                {data.date.date}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ChatNotifications;
