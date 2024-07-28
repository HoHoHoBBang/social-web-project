import React, { useContext, useEffect } from "react";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { EditProfileContext } from "../../contexts/editProfileContext";
import { AuthContext } from "../../contexts/authContext";
import useFollow from "../../hooks/useFollow";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import useChats from "../../hooks/useChats";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-regular-svg-icons";
import { faBriefcase, faCake } from "@fortawesome/free-solid-svg-icons";
import { ModalContext } from "../../contexts/modalContext";
import {
  InfoBirthInputProps,
  InfoInputProps,
} from "../../assets/types/postType";

const UserInformation = () => {
  const { uid } = useParams() as { uid: string };

  const { currentUser } = useContext(AuthContext);
  const {
    edit,
    setEditHandler,
    infoInput,
    setInfoInput,
    birthInput,
    setBirthInput,
    submitHandler,
    cancelHandler,
    displayNameErr,
    setDisplayNameErr,
  } = useContext(EditProfileContext);
  const { dispatch, setFollowModalOpen } = useContext(ModalContext);
  const { userProfile } = useGetUserProfile(uid);

  const { userProfile: currentUserProfile } = useGetUserProfile(
    currentUser ? currentUser.uid : "",
  );
  const { followHandler } = useFollow();
  const { selectHandler } = useChats();

  const navigate = useNavigate();

  useEffect(() => {
    const uidValidate = async () => {
      const uidRef = doc(db, "users", uid);
      const getUidRef = await getDoc(uidRef);

      if (!getUidRef.exists()) {
        navigate("/");
      }
    };

    return () => {
      uidValidate();
    };
  }, [uid, navigate]);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="absolute bottom-8 flex h-1/2 w-3/4 flex-col max-sm:bottom-6">
      {!edit ? (
        <div className="flex">
          <div className="flex flex-1 flex-col">
            <div className="flex w-full items-center gap-2">
              <p className="text-2xl font-bold dark:text-white">
                {userProfile?.userInfo.displayName}
              </p>

              {uid === currentUser.uid ? (
                <div className="flex h-10 items-center">
                  <button
                    className="flex items-center justify-center gap-1 rounded-full border-2 border-purple-500 px-1 py-0.5 text-purple-500 hover:bg-purple-500 hover:text-white"
                    onClick={setEditHandler}
                  >
                    <p className="text-xs">Edit</p>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 max-sm:absolute max-sm:-left-24 max-sm:bottom-5 max-sm:flex-col max-sm:items-start">
                  <div>
                    <p
                      className={`cursor-pointer rounded-full border-2 px-1 py-0.5 text-xs ${
                        !currentUserProfile?.following.includes(uid)
                          ? "border-purple-500 bg-purple-500 text-white hover:bg-purple-700"
                          : "text-gray-500 hover:bg-gray-500 hover:text-white"
                      }`}
                      onClick={() => followHandler(uid)}
                    >
                      {!currentUserProfile?.following.includes(uid)
                        ? "Follow"
                        : "Unfollow"}
                    </p>
                  </div>

                  <Link
                    to={"/chats"}
                    onClick={() =>
                      userProfile && selectHandler(userProfile.uid)
                    }
                    className="flex items-center justify-center gap-1 rounded-full border-2 border-purple-500 px-1 py-0.5 text-purple-500 hover:bg-purple-500 hover:text-white"
                  >
                    <p className="text-xs">Chat</p>
                    <p className="text-xs">
                      <FontAwesomeIcon icon={faCommentDots} />
                    </p>
                  </Link>
                </div>
              )}
            </div>

            <div>
              <p className="line-clamp-3 break-all text-sm text-gray-400">
                {userProfile?.userInfo.introduce}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <p className="text-sm text-gray-400">
                <FontAwesomeIcon icon={faBriefcase} />
              </p>
              <p className="line-clamp-1 text-sm text-gray-400">
                {userProfile?.userInfo.job}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <p className="text-sm text-gray-400">
                <FontAwesomeIcon icon={faCake} />
              </p>
              <p className="text-sm text-gray-400">
                {userProfile?.userInfo.birth}
              </p>
            </div>
          </div>
          <div className="flex w-full flex-[0.5] items-center justify-center gap-5 p-1 max-sm:absolute max-sm:-bottom-8 max-sm:-left-10">
            <div
              className="group flex cursor-pointer flex-col items-center"
              onClick={() => {
                setFollowModalOpen(true);
                dispatch({ type: "FOLLOWER" });
              }}
            >
              <p className="text-sm dark:text-white">Follower</p>
              <p className="font-bold group-hover:underline dark:text-white">
                {userProfile?.follower.length}
              </p>
            </div>
            <div
              className="group flex cursor-pointer flex-col items-center"
              onClick={() => {
                setFollowModalOpen(true);
                dispatch({ type: "FOLLOWING" });
              }}
            >
              <p className="text-sm dark:text-white">Following</p>
              <p className="font-bold group-hover:underline dark:text-white">
                {userProfile?.following.length}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-2 flex flex-col gap-0.5">
          <div className="flex">
            <input
              type="text"
              value={infoInput.displayName ?? userProfile?.userInfo.displayName}
              maxLength={15}
              placeholder="Displayname"
              onChange={(e) => {
                setInfoInput((prev: InfoInputProps) => ({
                  ...prev,
                  displayName: e.target.value,
                }));
                setDisplayNameErr(false);
              }}
              className={`w-1/2 rounded-lg bg-purple-100 px-2 py-0.5 text-sm outline-none dark:bg-neutral-500 dark:text-white ${displayNameErr ? "border-2 border-red-500" : ""}`}
            />
          </div>

          <div className="">
            <input
              type="text"
              maxLength={50}
              value={infoInput.introduce ?? userProfile?.userInfo.introduce}
              placeholder="Introduce"
              onChange={(e) =>
                setInfoInput((prev: InfoInputProps) => ({
                  ...prev,
                  introduce: e.target.value.trim(),
                }))
              }
              className="w-1/2 rounded-lg bg-purple-100 px-2 py-0.5 text-sm outline-none dark:bg-neutral-500 dark:text-white"
            />
          </div>

          <div className="">
            <input
              type="text"
              maxLength={20}
              value={infoInput.job ?? userProfile?.userInfo.job}
              placeholder="Job"
              onChange={(e) =>
                setInfoInput((prev: InfoInputProps) => ({
                  ...prev,
                  job: e.target.value.trim(),
                }))
              }
              className="w-1/2 rounded-lg bg-purple-100 px-2 py-0.5 text-sm outline-none dark:bg-neutral-500 dark:text-white"
            />
          </div>
          <div className="flex w-1/2 gap-1">
            <div className="w-full">
              <input
                type="date"
                value={birthInput.birth || userProfile?.userInfo.birth}
                onChange={(e) =>
                  setBirthInput((prev: InfoBirthInputProps) => ({
                    ...prev,
                    birth: e.target.value,
                  }))
                }
                className="w-full rounded-lg bg-purple-100 px-2 py-0.5 text-sm outline-none dark:bg-neutral-500 dark:text-white"
              />
            </div>
            <div className="flex w-1/2 gap-1">
              <button
                className="w-full rounded-lg bg-gray-400 px-2 py-1 hover:bg-gray-500"
                onClick={cancelHandler}
              >
                <p className="text-xs text-white">Cancel</p>
              </button>
              <button
                className="w-full rounded-lg bg-purple-500 px-2 py-1 hover:bg-purple-700"
                onClick={submitHandler}
              >
                <p className="text-xs text-white">Save</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInformation;
