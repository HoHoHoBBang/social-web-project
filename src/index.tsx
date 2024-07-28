import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./contexts/authContext";
import { PageContextProvider } from "./contexts/pageContext";
import { MenuContextProvider } from "./contexts/menuContext";
import { EditProfileContextProvider } from "./contexts/editProfileContext";
import { ChatContextProvider } from "./contexts/chatContext";
import { DarkModeContextProvider } from "./contexts/darkModeContext";
import { ModalContextProvider } from "./contexts/modalContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <AuthContextProvider>
    <EditProfileContextProvider>
      <MenuContextProvider>
        <DarkModeContextProvider>
          <ChatContextProvider>
            <PageContextProvider>
              <ModalContextProvider>
                <App />
              </ModalContextProvider>
            </PageContextProvider>
          </ChatContextProvider>
        </DarkModeContextProvider>
      </MenuContextProvider>
    </EditProfileContextProvider>
  </AuthContextProvider>,
);
