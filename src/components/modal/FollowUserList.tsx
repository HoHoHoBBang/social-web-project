import React, { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../../contexts/authContext";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import person from "../../assets/images/person.png";
import useFollow from "../../hooks/useFollow";
import { UserProfileProps } from "../../assets/types/postType";

interface Props {
  input: string;
  data: UserProfileProps;
  setFollowModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const FollowUserList = ({ input, data, setFollowModalOpen }: Props) => {
  const { currentUser } = useContext(AuthContext);
  const { userProfile } = useGetUserProfile(currentUser ? currentUser.uid : "");
  const { followHandler } = useFollow();

  const searchFriends =
    input &&
    data.userInfo.displayName
      .toLowerCase()
      .includes(input.trim().toLowerCase());

  if (input && !searchFriends) {
    return null;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <li className="flex items-center justify-between gap-2">
      <Link
        to={`/profile/${data.uid}`}
        onClick={() => setFollowModalOpen(false)}
        className="group flex w-full items-center gap-2 border-purple-500 p-2 transition-all duration-300 hover:border-l-8 hover:bg-purple-100 dark:border-neutral-900 dark:hover:bg-neutral-400"
      >
        <img
          className="h-8 w-8 rounded-full border bg-white object-cover"
          src={
            data.userInfo.photoURL && data.userInfo.photoURL !== null
              ? data.userInfo.photoURL
              : person
          }
          alt=""
        />
        <div className="flex flex-col">
          <p className="font-bold group-hover:text-purple-500 dark:text-neutral-300 dark:group-hover:text-white">
            {data.userInfo.displayName}
          </p>
        </div>
      </Link>
      <div className="">
        {data.uid !== currentUser.uid && (
          <p
            className={`cursor-pointer rounded-full border-2 px-1 py-0.5 text-xs ${
              !userProfile?.following.includes(data.uid)
                ? "text-purple-500 hover:bg-purple-500 hover:text-white dark:text-neutral-300 dark:group-hover:text-white"
                : "text-gray-500 hover:bg-gray-500 hover:text-white dark:text-neutral-300 dark:group-hover:text-white"
            }`}
            onClick={() => followHandler(data.uid)}
          >
            {!userProfile?.following.includes(data.uid) ? "Follow" : "Unfollow"}
          </p>
        )}
      </div>
    </li>
  );
};

export default FollowUserList;
