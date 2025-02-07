import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  onNeedRefresh() {
    console.log("새로운 Service Worker가 설치되었습니다.");
    if (confirm("새로운 업데이트가 있습니다. 지금 새로고침할까요?")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    console.log("PWA가 오프라인에서도 실행 준비 완료!");
  },
  onRegistered(swRegistration) {
    console.log("Service Worker 등록 성공:", swRegistration);
  },
  onRegisterError(error) {
    console.error("Service Worker 등록 실패:", error);
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
