import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";

const Login = () => {
  const {
    login,
    emailValidation,
    setEmailValidation,
    passwordValidation,
    setPasswordValidation,
    requestErr,
    setRequestErr,
  } = useLogin();

  const ref = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  const keyHandler = (e: KeyboardEvent) => {
    if (input.email !== "" && input.password !== "") {
      e.code === "Enter" && login(input);
    }
  };

  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <div className="flex h-2/3 w-1/2 overflow-hidden rounded-3xl border shadow-lg max-sm:h-full max-sm:w-full max-sm:flex-col max-sm:rounded-none">
        <div className="relative flex flex-[1.5] items-center justify-center bg-purple-500 max-sm:flex-1">
          <div className="absolute left-5 top-5">
            <p className="text-sm text-white">
              TEST ID : <span>test@naver.com / test2@naver.com</span>
            </p>
            <p className="text-sm text-white">
              TEST PW : <span>123123</span>
            </p>
          </div>
          <div>
            <p className="text-4xl font-bold text-white">Social App</p>
          </div>
        </div>

        <div className="relative flex flex-[2] flex-col items-center justify-evenly bg-white max-sm:flex-[8]">
          <div>
            <p className="text-4xl font-bold text-purple-600">Login</p>
          </div>

          <div className="flex w-full flex-col items-center gap-2">
            <input
              className={`w-3/5 rounded-lg bg-purple-100 p-2 outline-none ${emailValidation || requestErr ? "border border-red-500" : ""}`}
              type="text"
              placeholder="Email"
              onChange={(e) => {
                setInput({ ...input, email: e.target.value });
                setEmailValidation(false);
                setRequestErr(false);
              }}
              onKeyDown={keyHandler}
              ref={ref}
            />
            {emailValidation ? (
              <p className="w-3/5 text-start text-sm text-red-500">
                Email is valid
              </p>
            ) : null}
            <input
              className={`w-3/5 rounded-lg bg-purple-100 p-2 outline-none ${passwordValidation || requestErr ? "border border-red-500" : ""}`}
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setInput({ ...input, password: e.target.value });
                setPasswordValidation(false);
                setRequestErr(false);
              }}
              onKeyDown={keyHandler}
            />
            {passwordValidation ? (
              <p className="w-3/5 text-start text-sm text-red-500">
                Password is valid
              </p>
            ) : requestErr ? (
              <p className="w-3/5 text-start text-sm text-red-500">
                Too many requests <br /> Please try again later
              </p>
            ) : null}
          </div>

          <div className="flex w-full flex-col items-center gap-2">
            <div className="flex w-1/3 justify-center">
              <button
                className="w-full rounded-full bg-purple-500 p-1 text-lg font-bold text-white"
                onClick={() => login(input)}
              >
                Login
              </button>
            </div>

            <hr className="my-2 w-3/5" />
            <div>
              <p className="text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="font-bold text-red-500">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
