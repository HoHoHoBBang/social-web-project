import React, { useContext } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../../contexts/chatContext";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import person from "../../assets/images/person.png";
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { AuthContext } from "../../contexts/authContext";
import useFollow from "../../hooks/useFollow";
import ChatUser from "./ChatUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";

const Chat = () => {
  const { currentUser } = useContext(AuthContext);
  const { state, dispatch } = useContext(ChatContext);
  const { userProfile: currentUserProfile } = useGetUserProfile(
    currentUser ? currentUser.uid : "",
  );
  const { userProfile } = useGetUserProfile(state.userId);
  const { followHandler } = useFollow();

  const deleteHandler = async () => {
    const userChats = query(collection(db, "userChats"));

    await deleteDoc(doc(db, "chats", state.chatId));

    await getDocs(userChats).then((snapShot) =>
      snapShot.forEach(async (docData) => {
        await updateDoc(doc(db, "userChats", docData.id), {
          [state.chatId]: deleteField(),
        });
      }),
    );

    dispatch({ type: "INITIAL" });
  };

  return (
    <div className="flex h-dvh flex-[8] dark:bg-black">
      <div className="flex w-full flex-[6] items-center justify-center pt-16">
        {state.chatId !== "null" && (
          <div className="flex h-[95%] w-2/3 flex-col justify-between rounded-lg shadow-lg dark:bg-neutral-700 max-sm:w-[95%]">
            <div className="flex items-center justify-between px-5 py-1">
              <Link
                to={`/profile/${userProfile?.uid}`}
                className="flex items-center gap-2"
              >
                <img
                  className="h-8 w-8 rounded-full border bg-white object-cover"
                  src={
                    userProfile && userProfile.userInfo.photoURL !== null
                      ? userProfile.userInfo.photoURL
                      : person
                  }
                  alt=""
                />
                <p className="text-lg font-bold dark:text-white">
                  {userProfile?.userInfo.displayName}
                </p>
              </Link>
              <button
                onClick={deleteHandler}
                className="flex cursor-pointer items-center"
              >
                <p className="text-lg dark:text-white">
                  <FontAwesomeIcon icon={faTrashCan} />
                </p>
              </button>
            </div>

            <hr className="mb-2" />

            <div className="flex h-full flex-col overflow-y-scroll p-2 scrollbar-hide">
              {!currentUserProfile?.following.includes(state.userId) && (
                <div className="flex w-full flex-col items-center gap-2">
                  <p className="text-sm font-bold dark:text-white">
                    Do you know this person?
                  </p>
                  <div className="flex gap-2">
                    <div className="group cursor-pointer rounded-full border-2 border-purple-500 bg-purple-500 px-1 py-0.5 text-white hover:bg-purple-700">
                      <p
                        className="text-sm"
                        onClick={() => followHandler(state.userId)}
                      >
                        Follow
                      </p>
                    </div>

                    <button
                      onClick={deleteHandler}
                      className="group rounded-full border-2 border-red-500 bg-red-500 px-1 py-0.5 text-white hover:bg-red-700"
                    >
                      <p className="text-sm">Delete</p>
                    </button>
                  </div>

                  <hr className="mb-4 mt-2 w-full" />
                </div>
              )}
              <Messages />
            </div>
            <hr className="mb-2" />
            <div className="p-2">
              <Input />
            </div>
          </div>
        )}
      </div>
      <ChatUser />
    </div>
  );
};

export default Chat;
