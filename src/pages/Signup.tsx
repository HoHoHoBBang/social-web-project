import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useSignup from "../hooks/useSignup";

const Signup = () => {
  const ref = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  });

  const {
    submitHandler,
    emailUsed,
    setEmailUsed,
    emailValidation,
    setEmailValidation,
    passwordValidation,
    setPasswordValidation,
    passwordConfirm,
    setPasswordConfirm,
  } = useSignup();

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  const keyHandler = (e: KeyboardEvent) => {
    if (
      input.email !== "" &&
      input.password !== "" &&
      input.confirmPassword !== "" &&
      input.displayName !== ""
    ) {
      e.code === "Enter" && submitHandler(input);
    }
  };

  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <div className="flex h-2/3 w-1/2 overflow-hidden rounded-3xl border shadow-lg max-sm:h-full max-sm:w-full max-sm:flex-col max-sm:rounded-none">
        <div className="flex flex-[1.5] items-center justify-center bg-purple-500 max-sm:flex-1">
          <div>
            <p className="text-4xl font-bold text-white">Social App</p>
          </div>
        </div>

        <div className="flex flex-[2] flex-col items-center justify-evenly bg-white max-sm:flex-[8]">
          <div>
            <p className="text-4xl font-bold text-purple-600">Sign up</p>
          </div>

          <div className="flex w-full flex-col items-center gap-2">
            <input
              className={`w-3/5 rounded-lg bg-purple-100 p-2 outline-none ${emailUsed || emailValidation ? "border border-red-500" : ""}`}
              type="text"
              placeholder="Email"
              onChange={(e) => {
                setInput({ ...input, email: e.target.value });
                setEmailUsed(false);
                setEmailValidation(false);
              }}
              onKeyDown={keyHandler}
            />

            {emailUsed ? (
              <p className="w-3/5 text-start text-sm text-red-500">
                This email is already used
              </p>
            ) : emailValidation ? (
              <p className="w-3/5 text-start text-sm text-red-500">
                Email is invalid
              </p>
            ) : null}

            <input
              className="w-3/5 rounded-lg bg-purple-100 p-2 outline-none"
              type="text"
              placeholder="Displayname"
              onChange={(e) =>
                setInput({ ...input, displayName: e.target.value })
              }
              onKeyDown={keyHandler}
            />
            <input
              className={`w-3/5 rounded-lg bg-purple-100 p-2 outline-none ${passwordValidation ? "border border-red-500" : ""}`}
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setInput({ ...input, password: e.target.value });
                setPasswordValidation(false);
              }}
              onKeyDown={keyHandler}
            />

            {passwordValidation ? (
              <p className="w-3/5 text-start text-sm text-red-500">
                Password is too short <br /> (minimum is 6 characters)
              </p>
            ) : null}

            <input
              className={`w-3/5 rounded-lg bg-purple-100 p-2 outline-none ${passwordConfirm ? "border border-red-500" : ""}`}
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => {
                setInput({ ...input, confirmPassword: e.target.value });
                setPasswordConfirm(false);
              }}
              onKeyDown={keyHandler}
            />

            {passwordConfirm ? (
              <p className="w-3/5 text-start text-sm text-red-500">
                Password is invalid
              </p>
            ) : null}
          </div>

          <div className="flex w-full flex-col items-center gap-2">
            <div className="flex w-1/3 justify-center">
              <button
                className="w-full rounded-full bg-purple-500 p-1 text-lg font-bold text-white"
                onClick={() => submitHandler(input)}
              >
                Sign up
              </button>
            </div>
            <hr className="my-2 w-3/5" />
            <div>
              <p className="text-sm">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-red-500">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
