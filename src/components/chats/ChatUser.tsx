import React, { useState } from "react";
import useChats from "../../hooks/useChats";
import ChatUserList from "./ChatUserList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { UserChatProps } from "../../assets/types/postType";

const ChatUser = () => {
  const { chatList } = useChats();

  const [input, setInput] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div
      className={`h-full flex-[2] shadow-lg duration-300 dark:bg-neutral-700 max-sm:fixed max-sm:right-0 max-sm:w-24 ${open ? "" : "max-sm:-mr-24"}`}
    >
      <div className="relative mt-16 flex flex-col gap-2 bg-white dark:bg-neutral-700">
        <div
          className="absolute -left-8 top-0 hidden cursor-pointer rounded-lg bg-white duration-300 dark:bg-neutral-700 max-sm:flex"
          onClick={() => setOpen(!open)}
        >
          <FontAwesomeIcon
            className={`h-10 w-10 text-purple-500 duration-300 dark:text-neutral-500 ${open ? "rotate-180" : ""}`}
            icon={faCaretLeft}
          />
        </div>
        <div className="p-2">
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="w-full rounded-full bg-purple-100 px-3 py-1 outline-none dark:bg-neutral-500 dark:text-white max-sm:text-sm"
            placeholder="Search"
            value={input}
          />
        </div>

        <hr />

        <div>
          <p className="mx-2 text-lg font-bold dark:text-white max-sm:text-sm">
            Messages
          </p>
        </div>
        <ul className="flex h-full flex-col overflow-y-scroll scrollbar-hide">
          {chatList &&
            (Object.entries(chatList) as [string, UserChatProps][])
              .sort((a, b) => a[1].date?.createdAt - b[1].date?.createdAt)
              .map((data) => (
                <ChatUserList input={input} key={data[1].uid} data={data[1]} />
              ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatUser;
