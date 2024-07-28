import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import getTime from "../utils/getTime";
import { v4 as uuid } from "uuid";

const useFollow = () => {
  const { currentUser } = useContext(AuthContext);
  const { nowDate, nowTime } = getTime(new Date());

  const followHandler = async (id: string) => {
    if (!currentUser) return;

    try {
      const userRef = await getDoc(doc(db, "users", currentUser.uid));
      const postUserRef = await getDoc(doc(db, "users", id));

      const userData = userRef.data();
      const postUserData = postUserRef.data();

      await updateDoc(doc(db, "users", currentUser.uid), {
        following: userData?.following.includes(id)
          ? arrayRemove(id)
          : arrayUnion(id),
      });

      await updateDoc(doc(db, "users", id), {
        follower: postUserData?.follower.includes(currentUser.uid)
          ? arrayRemove(currentUser.uid)
          : arrayUnion(currentUser.uid),
      });

      if (!userData?.following.includes(id)) {
        await updateDoc(doc(db, "notifications", id), {
          notification: arrayUnion({
            id: uuid(),
            uid: currentUser.uid,
            date: nowDate,
            time: nowTime,
            createdAt: Date.now(),
            type: "follow",
            isChecked: false,
          }),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return { followHandler };
};

export default useFollow;
