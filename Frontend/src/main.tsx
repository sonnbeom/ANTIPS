import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {

    if (confirm("새로운 업데이트가 있습니다. 지금 새로고침할까요?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {

  },
  onRegistered(swRegistration) {

  },
  onRegisterError(error) {

  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
