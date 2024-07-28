import {
  collection,
  DocumentData,
  onSnapshot,
  query,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useEffect, useState } from "react";
import { UserProfileProps } from "../assets/types/postType";

const useSearch = () => {
  const [input, setInput] = useState("");
  const [user, setUser] = useState<UserProfileProps[]>([]);
  const [inputLength, setInputLength] = useState(false);

  useEffect(() => {
    if (input.trim() !== "" && input.length > 0) {
      setInputLength(true);
    } else if (input.trim() === "" && input.length === 0) {
      setUser([]);
      setInputLength(false);
    }

    if (inputLength) {
      const q = query(collection(db, "users"));

      const unsub = onSnapshot(q, (querySnapshot) => {
        const userList: UserProfileProps[] = [];

        querySnapshot.forEach((doc: DocumentData) => {
          const data = doc.data();

          if (
            data.email.toLowerCase().includes(input.trim().toLowerCase()) ||
            data.userInfo.displayName
              .toLowerCase()
              .includes(input.trim().toLowerCase())
          ) {
            userList.push(data);
          }
        });

        setUser(userList);
      });

      return () => unsub();
    }
  }, [input, inputLength]);

  return {
    input,
    setInput,
    user,
    setUser,
  };
};

export default useSearch;
