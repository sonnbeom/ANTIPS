// src/types/service-worker.d.ts
declare global {
  interface Window {
    registration: ServiceWorkerRegistration;
  }
}

export {};
