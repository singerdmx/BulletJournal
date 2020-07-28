/// <reference types="react-scripts" />

declare namespace global {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PUBLIC_URL: string;
    REACT_APP_HASH: string;
    REACT_APP_API_URI: string;
    REACT_APP_WS_URI: string;
  }
}
interface Window {
  Stripe: any;
}

declare module '*.ico';
declare module 'react-floating-action-button';
declare module 'quill-emoji';
