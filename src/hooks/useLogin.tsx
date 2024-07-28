import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { LoginProps } from "../assets/types/postType";
import { useState } from "react";

const useLogin = () => {
  const navigate = useNavigate();
  const [emailValidation, setEmailValidation] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(false);
  const [requestErr, setRequestErr] = useState(false);

  const login = async (input: LoginProps) => {
    const email = input.email;
    const password = input.password;

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      await updateDoc(doc(db, "users", res.user.uid), {
        online: true,
      });

      navigate("/");
    } catch (error: any) {
      switch (error.code) {
        case "auth/invalid-email":
          return setEmailValidation(true);
        case "auth/invalid-credential":
          return setPasswordValidation(true);
        case "auth/too-many-requests":
          return setRequestErr(true);
        default:
          return;
      }
    }
  };

  return {
    login,
    emailValidation,
    setEmailValidation,
    passwordValidation,
    setPasswordValidation,
    requestErr,
    setRequestErr,
  };
};

export default useLogin;
