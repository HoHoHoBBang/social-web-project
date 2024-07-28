import { faSearch, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useGetFollowingUser from "../../hooks/useGetFollowingUser";
import FollowUserList from "./FollowUserList";
import { UserProfileProps } from "../../assets/types/postType";

interface Props {
  setFollowModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  name: string;
}

const FollowModal = ({ setFollowModalOpen, name }: Props) => {
  const { uid } = useParams() as { uid: string };

  const [input, setInput] = useState("");

  const { followingUserProfile, followerUserProfile } =
    useGetFollowingUser(uid);

  return (
    <div className="fixed inset-0 z-[8] flex items-center justify-center bg-black bg-opacity-25 backdrop-blur-sm">
      <div className="h-2/3 w-1/3 rounded-lg bg-white dark:bg-neutral-700 max-sm:h-[90%] max-sm:w-[90%]">
        <div className="flex h-full flex-col gap-2 p-2">
          <div className="flex justify-between px-2">
            <p className="text-lg font-bold dark:text-white">
              {name ? "Followers" : "Followings"}
            </p>
            <p
              className="cursor-pointer text-lg dark:text-white"
              onClick={() => setFollowModalOpen(false)}
            >
              <FontAwesomeIcon icon={faX} />
            </p>
          </div>

          <div className="flex w-full items-center justify-center gap-2 rounded-full bg-purple-100 px-2 py-1 dark:bg-neutral-500">
            <input
              className="w-full bg-transparent px-1 outline-none dark:text-white"
              type="text"
              placeholder="Search friend"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <FontAwesomeIcon className="dark:text-white" icon={faSearch} />
          </div>

          <ul className="h-full w-full gap-1 overflow-y-scroll rounded-lg border-2 p-1 scrollbar-hide">
            {(name === "follower"
              ? followerUserProfile
              : followingUserProfile
            )?.map((data: UserProfileProps) => (
              <FollowUserList
                key={data.uid}
                input={input}
                data={data}
                setFollowModalOpen={setFollowModalOpen}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FollowModal;
