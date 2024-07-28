import React, { useContext } from "react";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthContext } from "./contexts/authContext";
import Chats from "./pages/Chats";
import Event from "./pages/Event";
import Navbar from "./components/navbar/Navbar";
import Leftbar from "./components/navbar/Leftbar";
import Rightbar from "./components/navbar/Rightbar";
import Loading from "./components/loading/Loading";

interface Props {
  children: JSX.Element;
}

const App = () => {
  const { currentUser } = useContext(AuthContext);

  const NavLeftbar = ({ children }: Props) => {
    return currentUser ? (
      <>
        <Navbar />
        <div className="flex">
          <Loading>
            <Leftbar />
            {children}
          </Loading>
        </div>
      </>
    ) : (
      children
    );
  };

  const NavLeftRightbar = ({ children }: Props) => {
    return currentUser ? (
      <>
        <Navbar />
        <div className="flex">
          <Loading>
            <Leftbar />
            {children}
            <Rightbar />
          </Loading>
        </div>
      </>
    ) : (
      children
    );
  };

  const LogoutUser = ({ children }: Props) => {
    return !currentUser ? <Navigate to="/login" /> : children;
  };

  const LoginUser = ({ children }: Props) => {
    return currentUser ? <Navigate to="/" /> : children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <LogoutUser>
                <NavLeftRightbar>
                  <Home />
                </NavLeftRightbar>
              </LogoutUser>
            }
          />
        </Route>
        <Route path="/chats">
          <Route
            index
            element={
              <LogoutUser>
                <NavLeftbar>
                  <Chats />
                </NavLeftbar>
              </LogoutUser>
            }
          />
        </Route>
        <Route
          path="/profile/:uid"
          element={
            <LogoutUser>
              <NavLeftbar>
                <Profile />
              </NavLeftbar>
            </LogoutUser>
          }
        />
        <Route path="/events">
          <Route
            index
            element={
              <LogoutUser>
                <NavLeftbar>
                  <Event />
                </NavLeftbar>
              </LogoutUser>
            }
          />
        </Route>
        <Route
          path="/login"
          element={
            <LoginUser>
              <Login />
            </LoginUser>
          }
        />
        <Route
          path="/signup"
          element={
            <LoginUser>
              <Signup />
            </LoginUser>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
