import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { arrayUnion, doc, setDoc } from "firebase/firestore";
import getTime from "../utils/getTime";
import { v4 as uuid } from "uuid";
import { SignupProps } from "../assets/types/postType";

const useSignup = () => {
  const navigate = useNavigate();
  const { eventDate } = getTime(new Date());
  const [emailUsed, setEmailUsed] = useState(false);
  const [emailValidation, setEmailValidation] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState(false);

  const submitHandler = async (input: SignupProps) => {
    const email = input.email;
    const password = input.password;
    const confirmPassword = input.confirmPassword;
    const displayName = input.displayName;

    const emailRegexr =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;

    emailRegexr.test(email)
      ? setEmailValidation(false)
      : setEmailValidation(true);

    password.trim().length >= 6
      ? setPasswordValidation(false)
      : setPasswordValidation(true);

    password === confirmPassword
      ? setPasswordConfirm(false)
      : setPasswordConfirm(true);

    if (!emailValidation && !passwordValidation && !passwordConfirm) {
      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);

        await updateProfile(res.user, {
          displayName,
        });

        await setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          email,
          userInfo: {
            displayName,
            photoURL: res.user.photoURL,
            backgroundPhotoURL: null,
            job: "",
            introduce: "",
            birth: "",
          },
          posts: [],
          follower: [],
          following: [],
          online: true,
          dark: false,
        });

        await setDoc(doc(db, "notifications", res.user.uid), {
          notification: [],
        });

        await setDoc(doc(db, "events", res.user.uid), {
          event: arrayUnion({
            id: uuid(),
            title: "Welcome",
            description: "Welcome to Socialapp",
            date: eventDate,
            color: "bg-red-300",
            createdAt: Date.now(),
          }),
        });

        navigate("/login");
      } catch (error: any) {
        switch (error.code) {
          case "auth/email-already-in-use":
            return setEmailUsed(true);
          default:
            return;
        }
      }
    }
  };

  return {
    submitHandler,
    emailUsed,
    setEmailUsed,
    emailValidation,
    setEmailValidation,
    passwordValidation,
    setPasswordValidation,
    passwordConfirm,
    setPasswordConfirm,
  };
};

export default useSignup;
