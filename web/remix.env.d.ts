/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />

import { providers } from 'ethers';

// Extend Window type in global TS namespace with ethereum property
declare global {
  interface Window {
    ethereum?: providers.ExternalProvider;
  }
}
