import { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { AuthContext } from "../contexts/authContext";

const useLogout = () => {
  const { currentUser } = useContext(AuthContext);

  const logout = async () => {
    if (!currentUser) return;

    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        online: false,
      });
      signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  return { logout };
};

export default useLogout;
