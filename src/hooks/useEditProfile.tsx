import { doc, updateDoc } from "firebase/firestore";
import { useContext } from "react";
import { db, storage } from "../firebase/firebase";
import { AuthContext } from "../contexts/authContext";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  ImageProps,
  InfoBirthInputProps,
  InfoInputProps,
} from "../assets/types/postType";

const useEditProfile = () => {
  const { currentUser } = useContext(AuthContext);

  const editHandler = async (
    userInfo: InfoInputProps,
    userBirth: InfoBirthInputProps,
    profileImage: ImageProps[],
    backgroundImage: ImageProps[],
  ) => {
    if (!currentUser) return;

    const job = userInfo.job ? userInfo.job : "";
    const introduce = userInfo.introduce ? userInfo.introduce : "";
    const displayName = userInfo.displayName ? userInfo.displayName : "";

    const birth = userBirth.birth ? userBirth.birth : "";

    try {
      if (profileImage.length > 0) {
        const profileResponse = await fetch(profileImage[0].url);
        const profileBlob = await profileResponse.blob();
        const profileStorageRef = ref(
          storage,
          `images/${currentUser.uid}/profile`,
        );

        const profileUploadTask = uploadBytesResumable(
          profileStorageRef,
          profileBlob,
        );

        profileUploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(profileUploadTask.snapshot.ref).then(
              (downloadURL) => {
                updateProfile(currentUser, {
                  photoURL: downloadURL,
                });

                updateDoc(doc(db, "users", currentUser.uid), {
                  "userInfo.photoURL": downloadURL,
                });
              },
            );
          },
        );
      }

      if (backgroundImage.length > 0) {
        const backgroundResponse = await fetch(backgroundImage[0].url);
        const backgroundBlob = await backgroundResponse.blob();
        const backgroundStorageRef = ref(
          storage,
          `images/${currentUser.uid}/background`,
        );
        const backgroundUploadTask = uploadBytesResumable(
          backgroundStorageRef,
          backgroundBlob,
        );

        backgroundUploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(backgroundUploadTask.snapshot.ref).then(
              (downloadURL) => {
                updateDoc(doc(db, "users", currentUser.uid), {
                  "userInfo.backgroundPhotoURL": downloadURL,
                });
              },
            );
          },
        );
      }

      updateProfile(currentUser, {
        displayName,
      });

      await updateDoc(doc(db, "users", currentUser.uid), {
        "userInfo.birth": birth,
        "userInfo.job": job,
        "userInfo.displayName": displayName,
        "userInfo.introduce": introduce,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return { editHandler };
};

export default useEditProfile;
