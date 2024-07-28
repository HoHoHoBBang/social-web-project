import React, { createContext, useContext, useEffect, useState } from "react";
import {
  ChildrenProps,
  EditProfileContextProps,
  ImageProps,
  InfoBirthInputProps,
  InfoInputProps,
} from "../assets/types/postType";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { AuthContext } from "./authContext";
import useEditProfile from "../hooks/useEditProfile";
import { deleteObject, listAll, ref } from "firebase/storage";
import { db, storage } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

export const EditProfileContext = createContext<EditProfileContextProps>({
  edit: false,
  setEdit: () => {},
  profileImage: [],
  backgroundImage: [],
  setEditHandler: () => {},
  infoInput: { job: "", introduce: "", displayName: "" },
  setInfoInput: () => {},
  birthInput: { birth: "" },
  setBirthInput: () => {},
  submitHandler: () => {},
  cancelHandler: () => {},
  imageUpdateHandler: () => {},
  deleteHandler: () => {},
  displayNameErr: false,
  setDisplayNameErr: () => {},
});

export const EditProfileContextProvider = ({ children }: ChildrenProps) => {
  const { currentUser } = useContext(AuthContext);
  const { userProfile } = useGetUserProfile(currentUser ? currentUser.uid : "");
  const { editHandler } = useEditProfile();

  const [displayNameErr, setDisplayNameErr] = useState(false);
  const [edit, setEdit] = useState(false);
  const [infoInput, setInfoInput] = useState<InfoInputProps>({
    job: "",
    introduce: "",
    displayName: "",
  });

  const [birthInput, setBirthInput] = useState<InfoBirthInputProps>({
    birth: "",
  });

  const [profileImage, setProfileImage] = useState<ImageProps[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<ImageProps[]>([]);

  useEffect(() => {
    if (userProfile) {
      setInfoInput({
        job: userProfile.userInfo.job,
        introduce: userProfile.userInfo.introduce,
        displayName: userProfile?.userInfo.displayName,
      });
      setBirthInput({ birth: userProfile.userInfo.birth });
    }
  }, [userProfile, edit]);

  const setEditHandler = () => {
    setEdit(!edit);
  };

  const submitHandler = () => {
    if (infoInput.displayName.trim().length > 0) {
      editHandler(infoInput, birthInput, profileImage, backgroundImage);
      setProfileImage([]);
      setBackgroundImage([]);
      setEdit(!edit);
    } else {
      setDisplayNameErr(true);
    }
  };

  const imageUpdateHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) => {
    try {
      if (e.target.files) {
        const newFiles = e.target.files;
        if (newFiles.length === 0) {
          return;
        }

        if (newFiles[0].type.split("/")[0] === "image") {
          if (id === "profile") {
            setProfileImage([
              {
                name: newFiles[0].name,
                url: URL.createObjectURL(newFiles[0]),
              },
            ]);
          } else if (id === "background") {
            setBackgroundImage([
              {
                name: newFiles[0].name,
                url: URL.createObjectURL(newFiles[0]),
              },
            ]);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cancelHandler = () => {
    setProfileImage([]);
    setBackgroundImage([]);
    setEdit(!edit);
  };

  const deleteHandler = (id: string) => {
    if (!currentUser) return;

    id === "profile" ? setProfileImage([]) : setBackgroundImage([]);

    const userProfileRef = ref(storage, `images/${currentUser.uid}`);

    const profileRef = ref(storage, `images/${currentUser.uid}/profile`);

    const backgroundRef = ref(storage, `images/${currentUser.uid}/background`);

    listAll(userProfileRef)
      .then((res) => {
        if (res.items.length > 0 && id === "profile") {
          deleteObject(profileRef);
        } else if (res.items.length > 0 && id === "background") {
          deleteObject(backgroundRef);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    if (id === "profile") {
      updateProfile(currentUser, {
        photoURL: "",
      });

      updateDoc(doc(db, "users", currentUser.uid), {
        "userInfo.photoURL": null,
      });
    } else if (id === "background") {
      updateDoc(doc(db, "users", currentUser.uid), {
        "userInfo.backgroundPhotoURL": null,
      });
    }
  };

  return (
    <EditProfileContext.Provider
      value={{
        edit,
        setEdit,
        profileImage,
        backgroundImage,
        setEditHandler,
        infoInput,
        setInfoInput,
        birthInput,
        setBirthInput,
        submitHandler,
        cancelHandler,
        imageUpdateHandler,
        deleteHandler,
        displayNameErr,
        setDisplayNameErr,
      }}
    >
      {children}
    </EditProfileContext.Provider>
  );
};
