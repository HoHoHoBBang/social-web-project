import { doc, DocumentData, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { UserProfileProps } from "../assets/types/postType";

const useGetUserProfile = (userId: string) => {
  const [userProfile, setUserProfile] = useState<UserProfileProps | null>(null);

  useEffect(() => {
    if (!userId) return;

    const unsub = onSnapshot(
      doc(db, "users", userId),
      (doc: DocumentData) => {
        if (doc.exists()) {
          setUserProfile(doc.data());
        } else {
          setUserProfile(null);
        }
      },
      (error) => {
        console.log(error);
      },
    );

    return () => {
      unsub();
    };
  }, [userId]);

  return { userProfile };
};

export default useGetUserProfile;
