import React, { useContext, useEffect } from "react";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import person from "../../assets/images/person.png";
import welcome from "../../assets/images/welcome.png";
import { useNavigate, useParams } from "react-router-dom";
import { EditProfileContext } from "../../contexts/editProfileContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotate, faX } from "@fortawesome/free-solid-svg-icons";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import UserInformation from "./UserInformation";
import Feed from "../feed/Feed";
import { ModalContext } from "../../contexts/modalContext";
import { ImageProps } from "../../assets/types/postType";

const ProfileHome = () => {
  const { uid } = useParams() as { uid: string };
  const { userProfile } = useGetUserProfile(uid);
  const {
    edit,
    profileImage,
    backgroundImage,
    imageUpdateHandler,
    deleteHandler,
  } = useContext(EditProfileContext);

  const { dispatch, setModalOpen } = useContext(ModalContext);

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

  return (
    <div className="h-dvh flex-[8] overflow-hidden dark:bg-black">
      <div className="relative z-[3] mt-14 flex h-72 w-full flex-col overflow-hidden bg-white p-2 dark:bg-black">
        <div className="flex items-center justify-center">
          <img
            src={
              userProfile?.userInfo.backgroundPhotoURL !== null
                ? userProfile?.userInfo.backgroundPhotoURL
                : welcome
            }
            alt=""
            className="h-40 w-full rounded-lg border-2 object-cover p-2 max-sm:h-24"
          />

          {edit && (
            <>
              <div className="absolute z-10">
                <label
                  htmlFor="background"
                  className="flex cursor-pointer items-center justify-center rounded-full border-4 bg-white"
                >
                  <p className="flex h-10 w-10 items-center justify-center text-3xl">
                    <FontAwesomeIcon icon={faRotate} />
                  </p>
                  <input
                    type="file"
                    id="background"
                    style={{ display: "none" }}
                    onChange={(e) => imageUpdateHandler(e, "background")}
                  />
                </label>
              </div>

              <div className="absolute right-3 top-3 z-10">
                <div className="flex cursor-pointer items-center justify-center rounded-full border-4 bg-white">
                  <p className="flex h-6 w-6 items-center justify-center">
                    <FontAwesomeIcon
                      onClick={() => deleteHandler("background")}
                      icon={faX}
                    />
                  </p>
                </div>
              </div>

              <div className="absolute left-0 top-0 h-full w-full">
                <div className="relative flex items-center justify-center">
                  {backgroundImage.map((data: ImageProps) => (
                    <img
                      key={data.name}
                      src={data.url}
                      alt={data.name}
                      className="h-52 w-full rounded-lg border-2 object-cover p-2"
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="absolute bottom-4 left-10 flex w-[90%] max-sm:-top-5 max-sm:left-3">
          <div className="flex w-full gap-5">
            <div className="relative flex items-center justify-center">
              <img
                src={
                  userProfile && userProfile.userInfo.photoURL !== null
                    ? userProfile.userInfo.photoURL
                    : person
                }
                alt=""
                className="h-36 w-36 rounded-full border-4 bg-white object-cover max-sm:h-20 max-sm:w-20"
              />

              {edit && (
                <>
                  <div className="absolute z-10">
                    <label
                      htmlFor="profile"
                      className="flex cursor-pointer items-center justify-center rounded-full border-4 bg-white"
                    >
                      <p className="flex h-10 w-10 items-center justify-center text-3xl">
                        <FontAwesomeIcon icon={faRotate} />
                      </p>
                      <input
                        type="file"
                        id="profile"
                        style={{ display: "none" }}
                        onChange={(e) => imageUpdateHandler(e, "profile")}
                      />
                    </label>
                  </div>

                  <div className="absolute right-2 top-2 z-10  max-sm:right-0 max-sm:top-24">
                    <div className="flex cursor-pointer items-center justify-center rounded-full border-4 bg-white">
                      <p className="flex h-6 w-6 items-center justify-center">
                        <FontAwesomeIcon
                          onClick={() => deleteHandler("profile")}
                          icon={faX}
                        />
                      </p>
                    </div>
                  </div>

                  <div className="absolute top-0">
                    <div className="relative flex h-full w-full items-center justify-center">
                      {profileImage.map((data: ImageProps) => (
                        <img
                          key={data.name}
                          src={data.url}
                          alt={data.name}
                          className="h-36 w-36 rounded-full border-4 bg-white object-cover max-sm:h-20 max-sm:w-20"
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex">
              <UserInformation />
              {edit && (
                <div className="absolute bottom-0 right-0 h-fit max-sm:-right-1 max-sm:bottom-0">
                  <button
                    onClick={() => {
                      setModalOpen(true);
                      dispatch({ type: "USERDELETE" });
                    }}
                    className="rounded-full bg-red-500 px-2 py-0.5 hover:bg-red-600"
                  >
                    <p className="text-sm text-white">Delete Account</p>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <Feed />
      </div>
    </div>
  );
};

export default ProfileHome;
