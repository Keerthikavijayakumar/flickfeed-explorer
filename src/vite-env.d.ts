/// <reference types="vite/client" />

import { ConfirmationResult } from 'firebase/auth';

declare global {
  interface Window {
    tempUserDetails: any;
    tempConfirmation: ConfirmationResult;
  }
}
